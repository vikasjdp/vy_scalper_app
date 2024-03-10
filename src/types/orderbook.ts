export type OrderBook = {
  //   stat: string; // Ok or Not_Ok
  norenordno: string; // Noren Order Number
  kidid: string; //
  uid: string; //
  actid: string; //
  exch: string; // Exchange Segment
  tsym: string; // Trading symbol
  qty: string; // Order Quantity
  ordenttm: string; //
  trantype: string; // Transaction type of the order B | S
  prctyp: string; // LMT / MKT
  fillshares?: string; // Total Traded Quantity of this order
  avgprc?: string; // Averget price for this order
  ret: string; // DAY / IOC /
  token: string; //
  mult: string; //
  prcftr: string; //
  pp: string; //
  ls: string; //
  ti: string; //
  prc: string; // Order Price
  trgprc?: string; // Order trigger price
  rprc: string; //
  dscqty: string; // Order disclosed quantity.
  s_prdt_ali: string; //
  prd: string; // I M C B O
  status: string; // Order status
  st_intrn: string; //
  norentm: string; //
  exch_tm?: string;
  remarks: string; // Any message Entered during order entry.
  rejreason?: string; // If order is rejected, reason in text form
  exchordid?: string; // Exchange Order Number
  cancelqty?: string; // Canceled qty for order which is in status cancelled.
  rqty: string; //
  ltp?: string;
};
