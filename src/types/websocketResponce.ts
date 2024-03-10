export type WsConnect = {
  t: "ck";
  uid?: string;
  s: "OK" | "Not_Ok";
};

export type WsTouchLine = {
  t: "tk" | "tf";
  e: string;
  tk: string;
  ts?: string;
  pp?: string;
  ls?: string;
  ti?: string;
  lp?: string;
  pc?: string;
  o?: string;
  h?: string;
  l?: string;
  c?: string;
  ap?: string;
  v?: string;
  oi?: string;
  poi?: string;
  bp1?: string;
  sp1?: string;
  bq1?: string;
  sq1?: string;
};

type WsOrderUpdate = {
  t: "om"; // "om",
  norenordno: string; // "24012500098952",
  uid: string; // "FT006654",
  actid: string; // "FT006654",
  exch: string; // "NSE",
  tsym: string; // "RELIANCE-EQ",
  trantype: string; // "S",
  qty: string; // "1",
  prc: string; // "2684.00",
  pcode: string; // "I",
  remarks: string; // "algo-link",
  rejreason?: string; //
  status: "PENDING" | "OPEN" | "CANCELED" | "REJECTED" | "COMPLETE";
  reporttype:
    | "NewAck"
    | "PendingNew"
    | "New"
    | "ModAck"
    | "PendingReplace"
    | "Replaced"
    | "PendingCancel"
    | "Canceled"
    | "Rejected"
    | "Fill"
    | string;
  prctyp: string; // "LMT",
  ret: string; // "DAY",
  exchordid: string; // "",
  dscqty: string; // "0"
  exch_tm?: string; //"25-01-2024 10:24:51"
};

export type WsResponse = WsConnect | WsTouchLine | WsOrderUpdate;
