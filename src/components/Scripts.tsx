"use client";
import { VyApi } from "@/lib/VyApi";
import { NFOScript } from "@/types";
import React, { useEffect, useReducer, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useDispatch } from "react-redux";
import { addToWatchlist } from "@/store/watchlistSlice";
import { OrderShema, OrderType } from "@/validation/order";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const Scripts = ({
  script,
  optt,
  index,
  vy,
  ws,
}: {
  script: NFOScript;
  optt: string;
  index: string;
  vy: VyApi;
  ws: WebSocket;
}) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [strick, setStrick] = useState<string>("");
  const [showInput, setShowInput] = useState(false);
  useEffect(() => {
    if (strick.length != 5) return;
    const t = setTimeout(() => {
      searchScript();
    }, 500);

    return () => {
      clearTimeout(t);
    };
  }, [strick]);

  const form = useForm<OrderType>({
    resolver: zodResolver(OrderShema),
  });

  async function searchScript() {
    const data = await vy.searchScript(`${index} ${strick} ${optt}`, "NFO");
    if (data) {
      if (data.stat === "Not_Ok") {
        toast({ variant: "destructive", description: data.emsg });
        return;
      }

      dispatch(addToWatchlist(data.values[0]));
      ws.send(
        JSON.stringify({
          t: "t",
          k: `${data.values[0].exch}|${data.values[0].token}`,
        })
      );
      setShowInput(false);
    }
  }

  async function onSubmit(data: OrderType) {
    try {
      const res = await vy.placeOrder(data);
      if (res.stat === "Not_Ok") {
        toast({
          variant: "destructive",
          description: res.emsg,
        });
        return;
      }
      toast({
        title: "Success",
        description: `Order no. ${res.norenordno} placed`,
      });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    form.reset({
      tsym: script.tsym,
      exch: script.exch,
      qty: script.ls,
      prd: "M",
      prctyp: "LMT",
      trantype: "B",
    });
  }, [script.tsym]);

  const showPriceInput = form.watch("prctyp") === "LMT";

  return (
    <div
      className={`relative ${
        optt == "CE" ? "bg-teal-800" : "bg-rose-900"
      } w-52 p-2 rounded-lg`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {showInput ? (
            <div className="flex items-center">
              <Input
                className="border-0 p-0 h-6 focus-visible:ring-0"
                placeholder="Strick Price"
                value={strick}
                onChange={(e) => {
                  setStrick(e.target.value);
                }}
              />
              <span
                className="cursor-pointer"
                onClick={() => {
                  setShowInput(false);
                }}
              >
                x
              </span>{" "}
            </div>
          ) : (
            <span
              onClick={() => {
                setShowInput(true);
              }}
            >
              {script.dname.split(" ")[2]} {optt}
            </span>
          )}
        </div>
        <div className="font-bold">{script.ltp}</div>
      </div>
      <Form {...form}>
        <form>
          <div>
            <FormField
              name="prctyp"
              control={form.control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4 pl-2"
                >
                  <FormItem className="flex items-center space-x-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MKT" />
                    </FormControl>
                    <FormLabel className="font-normal">Market</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="LMT" />
                    </FormControl>
                    <FormLabel className="font-normal">Limit</FormLabel>
                  </FormItem>
                </RadioGroup>
              )}
            />
          </div>
          <div className="flex justify-between items-center gap-4 pl-2">
            <div className="w-12">
              <FormField
                name="qty"
                control={form.control}
                defaultValue={script.ls}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-0 border-b-2 border-white/50 rounded-none focus-visible:ring-0 p-0 h-6"
                        type="number"
                        min={script.ls}
                        step={script.ls}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-24">
              {showPriceInput && (
                <FormField
                  name="prc"
                  control={form.control}
                  shouldUnregister={true}
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="border-0 border-b-2 border-white/50 rounded-none focus-visible:ring-0 p-0 h-6"
                          min={script.ti}
                          step={script.ti}
                          placeholder="Price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              variant="default"
              size="sm"
              className="h-6 text-lg font-bold"
            >
              B
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Scripts;
