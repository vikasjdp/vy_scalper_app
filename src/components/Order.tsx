"use client";
import { VyApi } from "@/lib/VyApi";
import { OrderBook } from "@/types";
import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MOSchema, MOrder } from "@/validation/order";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "./ui/form";
import { useToast } from "./ui/use-toast";

const Order = ({ order, vy }: { order: OrderBook; vy: VyApi }) => {
  const { toast } = useToast();
  const [editOrder, setEditOrder] = useState(false);
  const form = useForm<MOrder>({
    resolver: zodResolver(MOSchema),
    defaultValues: {
      norenordno: order.norenordno,
      tsym: order.tsym,
      exch: order.exch,
      prctyp: order.prctyp as "MKT" | "LMT",
    },
  });

  async function onSubmit(value: MOrder) {
    const res = await vy.modifyOrder(value);
    console.log(res);
    if (res.stat === "Not_Ok") {
      toast({
        variant: "destructive",
        description: res.emsg,
      });
    } else {
      toast({
        variant: "default",
        description: `${res.result}.`,
      });
    }
    setEditOrder(false);
  }
  async function cancelOrder() {
    const res = await vy.cancelOrder(order.norenordno);
    if (res.stat === "Not_Ok") {
      toast({
        variant: "destructive",
        description: res.emsg,
      });
    } else {
      toast({
        variant: "default",
        description: `${res.result} Canceled.`,
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative border-y p-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Badge
                className={`${
                  order.trantype === "B" ? "bg-green-700" : "bg-red-700"
                } text-white `}
              >
                {order.trantype === "B" ? "Buy" : "Sell"}
              </Badge>
              {editOrder ? (
                <FormField
                  control={form.control}
                  name="qty"
                  defaultValue={order.qty}
                  render={({ field }) => (
                    <div className="flex gap-2 items-center">
                      <XMarkIcon
                        onClick={() => setEditOrder(false)}
                        className="size-4 cursor-pointer"
                      />
                      <Input
                        type="number"
                        min={order.ls}
                        step={order.ls}
                        className="h-4 w-16 text-xs"
                        {...field}
                      />
                      <CheckIcon
                        onClick={form.handleSubmit(onSubmit)}
                        className="size-4 cursor-pointer"
                      />
                    </div>
                  )}
                />
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => setEditOrder(true)}
                >
                  {order.qty}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <span>{order.norentm.split(" ")[0]}</span>
              <span>{order.status}</span>
              <XMarkIcon
                onClick={cancelOrder}
                className="size-4 bg-red-500 rounded-full cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <span>{order.tsym}</span>
            <div className="flex items-center space-x-2">
              {editOrder ? (
                <FormField
                  control={form.control}
                  name="prc"
                  defaultValue={order.prc}
                  render={({ field }) => (
                    <div className="flex gap-2 items-center">
                      <XMarkIcon
                        onClick={() => setEditOrder(false)}
                        className="size-4 cursor-pointer"
                      />
                      <Input
                        type="number"
                        className="h-4 w-16 text-xs"
                        {...field}
                      />
                      <CheckIcon
                        onClick={form.handleSubmit(onSubmit)}
                        className="size-4 cursor-pointer"
                      />
                    </div>
                  )}
                />
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => setEditOrder(true)}
                >
                  {order.prc}
                </span>
              )}
              {/* <span>{order.trgprc}</span> */}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="space-x-2">
              <span>{order.exch}</span>
              <span>{order.s_prdt_ali}</span>
              <span>{order.prctyp}</span>
            </div>
            <div>{order.ltp}</div>
          </div>

          {/* Overlay */}
        </div>
      </form>
    </Form>
  );
};

export default Order;
