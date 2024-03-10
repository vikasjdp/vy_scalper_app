import { z } from "zod";

const OrderBase = z.object({
  uid: z.string().optional(),
  actid: z.string().optional(),
  exch: z.string(),
  tsym: z.string(),
  qty: z.string(),
  prd: z.enum(["C", "M", "I"]),
  trantype: z.enum(["B", "S"]),
  ret: z.string().default("DAY"),
  remarks: z.string().default("algo-link"),
  ordersource: z.string().default("API"),
});

const OrderMkt = OrderBase.merge(
  z.object({ prctyp: z.enum(["MKT"]), prc: z.string().default("0") })
);
const OrderLimit = OrderBase.merge(
  z.object({
    prctyp: z.enum(["LMT"]),
    prc: z.string().min(1, { message: "Price is required" }),
  })
);

export const OrderShema = z.discriminatedUnion("prctyp", [
  OrderMkt,
  OrderLimit,
]);

export type OrderType = z.infer<typeof OrderShema>;
