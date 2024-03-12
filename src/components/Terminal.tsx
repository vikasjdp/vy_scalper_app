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
import {
  initOrderList,
  removeOrdrer,
  updateOrderLtp,
} from "@/store/orderSlice";
import Order from "./Order";
import { initPosition, updatePositionLtp } from "@/store/positionSlice";
import Position from "./Position";
import useMediaQuery from "@/hooks/use-media-query";
import { FlattradeApi } from "@/lib/flattradeApi";

const Terminal = ({ account, wsurl }: { account: IAccount; wsurl: string }) => {
  let vy: VyApi;
  if (account.broker === "finvasia") {
    vy = new FinvasiaApi(account.userId, account.token!);
  } else {
    vy = new FlattradeApi(account.userId, account.token!);
  }

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const ws = useRef<WebSocket>();
  const [index, setIndex] = useState(INDEXES[0]);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { width, height } = useMediaQuery();

  const isDesktop = width > 768;

  const { ceScript, peScript } = useSelector(
    (store: RootState) => store.watchlist
  );
  const orders = useSelector((store: RootState) => store.orderlist.orders);
  const positons = useSelector(
    (store: RootState) => store.positionlist.positions
  );

  // API Calls
  async function getOrders(vy: VyApi) {
    try {
      const res = await vy.getOrderBook();
      if ("stat" in res) {
        toast({ description: res.emsg });
        return;
      }
      // console.log(res);
      let filtered = res.filter(
        (res) => res.status === "PENDING" || res.status === "OPEN"
      );
      dispatch(initOrderList(filtered));
    } catch (error: any) {
      toast({ description: error.message });
    }
  }

  async function getPositions(vy: VyApi) {
    try {
      const res = await vy.getPositionBook();
      if ("stat" in res) {
        toast({ description: res.emsg }); //Error Occurred : 5 \"no data\"
        return;
      }
      console.log(res);
      dispatch(initPosition(res));
    } catch (error: any) {
      toast({ description: error.message });
    }
  }

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

        tokens = [
          ...tokens,
          ...orders.map((o) => `${o.exch}|${o.token}`),
          ...positons.map((o) => `${o.exch}|${o.token}`),
        ];
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
          dispatch(updatePositionLtp({ token: data.tk, lp: data.lp }));
        }
        break;
      case "om":
        switch (data.reporttype) {
          case "New":
          case "Replaced":
            getOrders(vy);
            break;
          case "Canceled":
            dispatch(removeOrdrer(data.norenordno));
            break;
          case "Fill":
            if (data.status === "COMPLETE") {
              dispatch(removeOrdrer(data.norenordno));
            } else {
              console.log("fill");
              console.log(data);
            }
            console.log("init positions sate");
            audioPlayer.current?.play();
            getPositions(vy);
            break;
          case "Rejected":
            toast({ variant: "destructive", description: data.rejreason });
            // getOrders(vy);
            // audioPlayer.current?.play();
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

  useEffect(() => {
    getOrders(vy);
    getPositions(vy);
    ws.current = new WebSocket(wsurl);

    ws.current.onopen = wsOpen;
    ws.current.onmessage = wsMsg;
    ws.current.onclose = (ev) => {
      console.log("ws close");
    };
    ws.current.onerror = (ev) => {
      console.error("ws errror");
    };
    return () => {
      ws.current!.close();
    };
  }, []);

  return (
    <div className="min-h-screen px-2 sm:px-4">
      <ResizablePanelGroup
        direction={isDesktop ? "horizontal" : "vertical"}
        className="min-h-screen border rounded-lg"
      >
        <ResizablePanel defaultSize={isDesktop ? 50 : 30}>
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
          <Watchlist vy={vy} index={index} ws={ws.current!} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical" className="">
            <ResizablePanel defaultSize={isDesktop ? 50 : 30}>
              <div>
                <h2 className="text-center">Orders</h2>
                {orders.map((order) => (
                  <Order key={order.norenordno} order={order} vy={vy} />
                ))}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={isDesktop ? 50 : 60}>
              <div>
                <h2 className="text-center">Positions</h2>
                {positons.map((p) => (
                  <Position key={p.token} position={p} vy={vy} />
                ))}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      <audio ref={audioPlayer} src="/suspense_3.mp3"></audio>
    </div>
  );
};

export default Terminal;
