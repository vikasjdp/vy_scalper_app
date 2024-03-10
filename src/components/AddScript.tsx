"use client";
import { VyApi } from "@/lib/VyApi";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { useDispatch } from "react-redux";
import { addToWatchlist } from "@/store/watchlistSlice";

const AddScript = ({
  optt,
  index,
  vy,
  ws,
}: {
  optt: string;
  index: string;
  vy: VyApi;
  ws: WebSocket;
}) => {
  const [strick, setStrick] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (strick.length != 5) return;
    const t = setTimeout(() => {
      searchScript();
    }, 500);

    return () => {
      clearTimeout(t);
    };
  }, [strick]);

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
    }
  }
  return (
    <div
      className={`w-48 relative ${optt == "CE" ? "bg-teal-800" : "bg-red-800"}`}
    >
      <Input
        value={strick}
        onChange={(e) => {
          setStrick(e.target.value);
        }}
        placeholder="Enter Strick"
      />
    </div>
  );
};

export default AddScript;
