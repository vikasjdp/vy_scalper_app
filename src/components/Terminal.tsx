"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
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

const Terminal = ({ account, wsurl }: { account: IAccount; wsurl: string }) => {
  let vy: VyApi;
  if (account.broker === "finvasia") {
    vy = new FinvasiaApi(account.userId, account.token!);
  } else {
    throw Error("uncode part");
  }

  const audioPlayer = useRef(null);
  const [index, setIndex] = useState(INDEXES[0]);
  const dispatch = useDispatch();

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
      // case "ck":
      //   break;
      case "tk":
      case "tf":
        if (data.lp) {
          dispatch(updateScript({ token: data.tk, lp: data.lp }));
        }
        break;
      default:
        // audioPlayer.current?.play();
        console.log(data);
    }
  }

  const ws = new WebSocket(wsurl);
  ws.onopen = wsOpen;
  ws.onmessage = wsMsg;
  ws.onclose = (ev) => {
    console.log("ws close");
  };
  ws.onerror = (ev) => {
    console.error("ws errror");
  };

  // useEffect(() => {
  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  return (
    <div className="min-h-screen px-4">
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
          <Watchlist vy={vy} index={index} ws={ws} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div>order</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div>positsion</div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <audio ref={audioPlayer} src="/suspense_3.mp3"></audio>
      <button
        onClick={() => {
          // audioPlayer.current?.play();
        }}
      >
        play
      </button>
    </div>
  );
};

export default Terminal;
