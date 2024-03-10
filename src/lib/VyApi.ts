import { ErrorResponse, OrderResponse, SearchResponse } from "@/types";
import { OrderType } from "@/validation/order";

export interface VyApi {
  uid: string;
  token: string;
  getWsUrl(): string;
  searchScript(
    stext: string,
    exch: string
  ): Promise<SearchResponse | ErrorResponse>;
  placeOrder(data: OrderType): Promise<OrderResponse | ErrorResponse>;
}
