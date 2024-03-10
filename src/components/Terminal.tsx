"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VyApi } from "@/lib/VyApi";
import { IAccount } from "@/models/Account";
import { FinvasiaApi } from "@/lib/finvasiaApi";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Watchlist from "./Watchlist";
import { INDEXES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { WsResponse } from "@/types";
import { updateScript } from "@/store/watchlistSlice";
import { RootState } from "@/store";
import { useToast } from "./ui/use-toast";
import { initOrderList, updateOrderLtp } from "@/store/orderSlice";
import Order from "./Order";

const Terminal = ({ account, wsurl }: { account: IAccount; wsurl: string }) => {
  let vy: VyApi;
  if (account.broker === "finvasia") {
    vy = new FinvasiaApi(account.userId, account.token!);
  } else {
    throw Error("uncode part");
  }

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const ws = useRef<WebSocket>(new WebSocket(wsurl));
  const [index, setIndex] = useState(INDEXES[0]);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { ceScript, peScript } = useSelector(
    (store: RootState) => store.watchlist
  );
  const orders = useSelector((store: RootState) => store.orderlist.orders);

  // API Calls
  async function getOrders(vy: VyApi) {
    try {
      const res = await vy.getOrderBook();
      if ("stat" in res) {
        toast({ description: res.emsg });
        return;
      }
      // console.log(res);
      // let filtered = res.filter(
      //   (res) => res.status === "PENDING" || res.status === "OPEN"
      // );
      dispatch(initOrderList(res));
    } catch (error: any) {
      toast({ description: error.message });
    }
  }

  // async function getPositions(vy: VyApi) {
  //   try {
  //     const res = await vy.getPositionBook();
  //     if ("stat" in res) {
  //       toast({ description: res.emsg }); //Error Occurred : 5 \"no data\"
  //       return;
  //     }
  //     dispatch(initPosition(res));
  //   } catch (error: any) {
  //     toast({ description: error.message });
  //   }
  // }

  // Web Socket funciton
  function wsOpen(this: WebSocket, ev: Event) {
    this.send(
      JSON.stringify({
        t: "c",
        uid: account.userId,
        actid: account.userId,
        source: "API",
        susertoken: account.token,
      })
    );
  }

  function wsMsg(this: WebSocket, ev: MessageEvent<string>) {
    let data: WsResponse = JSON.parse(ev.data);
    switch (data.t) {
      case "ck":
        let tokens: string[] = [];
        if (ceScript) tokens.push(`${ceScript.exch}|${ceScript.token}`);
        if (peScript) tokens.push(`${peScript.exch}|${peScript.token}`);

        tokens = [...tokens, ...orders.map((o) => `${o.exch}|${o.token}`)];
        console.log(tokens);
        tokens = tokens.filter((t, i) => tokens.indexOf(t) === i);
        console.log(tokens);
        this.send(
          JSON.stringify({
            t: "o",
            uid: account.userId,
            actid: account.userId,
          })
        );
        // Subcribe Watchlist script touchline
        ws.current?.send(
          JSON.stringify({
            t: "t",
            k: tokens.join("#"),
          })
        );
        break;
      case "tk":
      case "tf":
        if (data.lp) {
          dispatch(updateScript({ token: data.tk, lp: data.lp }));
          dispatch(updateOrderLtp({ token: data.tk, lp: data.lp }));
        }
        break;
      case "om":
        switch (data.reporttype) {
          case "New":
          case "Replaced":
            // getOrders(vy.current!);
            break;
          case "Canceled":
            // dispatch(removeOrdrer(data.norenordno));
            break;
          case "Fill":
            if (data.status === "COMPLETE") {
              // dispatch(removeOrdrer(data.norenordno));
            } else {
              console.log(data);
            }
            console.log("init positions sate");
            // getPositions(vy.current!);
            break;
          case "Rejected":
            toast({ variant: "destructive", description: data.rejreason });
            getOrders(vy);
            audioPlayer.current?.play();
            break;
          case "NewAck":
          case "ModAck":
          case "PendingNew":
          case "PendingReplace":
          case "PendingCancel":
            console.log(data.status);
            break;

          default:
            console.log(data);
            break;
        }
        break;
      default:
        audioPlayer.current?.play();
        console.log(data);
    }
  }

  ws.current.onopen = wsOpen;
  ws.current.onmessage = wsMsg;
  ws.current.onclose = (ev) => {
    console.log("ws close");
  };
  ws.current.onerror = (ev) => {
    console.error("ws errror");
  };

  useEffect(() => {
    getOrders(vy);
    // return () => {
    //   ws.close();
    // };
  }, []);

  return (
    <div className="min-h-screen px-2 sm:px-4">
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-screen border rounded-lg"
      >
        <ResizablePanel defaultSize={40}>
          <Select
            value={index}
            onValueChange={(value) => {
              setIndex(value);
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDEXES.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Watchlist vy={vy} index={index} ws={ws.current} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div>
            <h2 className="text-center">Orders</h2>
            {orders.map((order) => (
              <Order key={order.norenordno} order={order} vy={vy} />
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div>positsion</div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <audio ref={audioPlayer} src="/suspense_3.mp3"></audio>
    </div>
  );
};

export default Terminal;
