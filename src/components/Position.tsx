import { VyApi } from "@/lib/VyApi";
import { PositionBook } from "@/types";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { OrderShema, OrderType } from "@/validation/order";

const Position = ({ position, vy }: { position: PositionBook; vy: VyApi }) => {
  const tragetRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [showTargetInput, setShowTargetInput] = useState<boolean>(false);

  const slRef = useRef<HTMLInputElement>(null);
  const [sl, setSl] = useState<number | null>(null);
  const [showSlInput, setShowSlInput] = useState<boolean>(false);

  const [tsl, setTsl] = useState(1);

  function handleTarget() {
    const value = tragetRef.current?.value;
    if (Number.isNaN(Number(value)) || value === "" || value === "0") {
      setTarget(null);
      setShowTargetInput(false);
      return;
    }
    setTarget(Number(value));
    setShowTargetInput(false);
  }

  function handleSl() {
    const value = slRef.current?.value;
    if (Number.isNaN(Number(value)) || value === "" || value === "0") {
      setSl(null);
      setShowSlInput(false);
      return;
    }
    setSl(Number(value));
    setShowSlInput(false);
  }

  if (sl) {
    if (parseInt(position.netqty) > 0) {
      if (parseFloat(position.lp) < sl) {
        handleClosePosition();
      }
    }
    if (parseInt(position.netqty) < 0) {
      if (parseFloat(position.lp) > sl) {
        handleClosePosition();
      }
    }
  }

  async function handleClosePosition(Price = 0) {
    setSl(null);
    setTarget(null);
    const data: OrderType = {
      exch: position.exch,
      tsym: position.tsym,
      prc: Price.toString(),
      prctyp: "MKT",
      trantype: parseInt(position.netqty) > 0 ? "S" : "B",
      prd: position.prd as "C" | "I" | "M",
      qty: position.netqty,
      ret: "DAY",
      remarks: "algo-link",
      ordersource: "api",
    };

    vy.placeOrder(data);
  }
  return position.netqty !== "0" ? (
    <div className="group relative border-y p-1 text-xs sm:text-sm sm:p-2">
      <div className="flex justify-between items-center">
        <span className="">{position.tsym}</span>
        <span className="mr-4">Qty: {position.netqty}</span>
        <span>Avg: {position.netavgprc}</span>
        <span>LTP: {position.lp}</span>
        <span>
          P&L:
          {(
            Number(position.netqty) *
            (Number(position.lp) -
              Number(position.netavgprc) * Number(position.prcftr))
          ).toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <div className="basis-40 overflow-hidden h-7 flex gap-2 items-center">
          {showSlInput ? (
            <>
              <XMarkIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setShowSlInput(false);
                }}
              />
              <Input
                ref={slRef}
                defaultValue={sl!}
                className="text-xs h-7"
                type="number"
              />
              <CheckIcon
                className="w-6 h-6 cursor-pointer"
                onClick={handleSl}
              />
            </>
          ) : (
            <>
              {sl ? (
                <>
                  <Button
                    onClick={() => setSl((prev) => prev! - tsl)}
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <ChevronDownIcon className="size-4" />
                  </Button>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setShowSlInput(true);
                    }}
                  >
                    SL: {sl}
                  </span>
                  <Button
                    onClick={() => setSl((prev) => prev! + tsl)}
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <ChevronUpIcon className="size-4" />
                  </Button>
                </>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowSlInput(true);
                  }}
                >
                  Set Stoploss
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex justify-center items-center gap-2">
          <span>TSL</span>
          <Button
            onClick={() => setTsl((pre) => pre - 1)}
            variant="outline"
            size="icon"
            className="h-6 w-6"
          >
            <ChevronDownIcon className="size-4" />
          </Button>
          <span>{tsl}</span>
          <Button
            onClick={() => setTsl((pre) => pre + 1)}
            variant="outline"
            size="icon"
            className="h-6 w-6"
          >
            <ChevronUpIcon className="size-4" />
          </Button>
        </div>
        <div className="basis-40 overflow-hidden h-7 flex gap-2 items-center">
          {showTargetInput ? (
            <>
              <XMarkIcon
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setShowTargetInput(false);
                }}
              />
              <Input
                ref={tragetRef}
                defaultValue={target!}
                className="text-xs h-7"
                type="number"
              />
              <CheckIcon
                className="w-6 h-6 cursor-pointer"
                onClick={handleTarget}
              />
            </>
          ) : (
            <>
              {target ? (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowTargetInput(true);
                  }}
                >
                  TGT: {target}
                </span>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowTargetInput(true);
                  }}
                >
                  Set Traget
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex justify-center items-center">
          <XMarkIcon
            className="size-4 bg-red-500 hover:bg-red-800 rounded-xl cursor-pointer"
            onClick={() => {
              handleClosePosition();
            }}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="border-y p-1 sm:p-2 flex justify-between items-center text-xs sm:text-sm">
      <div className="basis-60 overflow-hidden h-6 flex">
        <span className="w-full">{position.tsym}</span>
      </div>
      <div className="basis-32 overflow-hidden h-6 flex">
        <span className="w-full">LTP:{position.lp}</span>
      </div>
      <div className="basis-32 overflow-hidden h-6 flex">
        <span className="w-full">MTM: {position.rpnl}</span>
      </div>
    </div>
  );
};

export default Position;
