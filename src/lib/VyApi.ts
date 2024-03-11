import {
  CancelOrderResponse,
  ErrorResponse,
  OrderBook,
  OrderResponse,
  PositionBook,
  SearchResponse,
} from "@/types";
import { MOrder, OrderType } from "@/validation/order";

export interface VyApi {
  uid: string;
  token: string;
  getWsUrl(): string;
  searchScript(
    stext: string,
    exch: string
  ): Promise<SearchResponse | ErrorResponse>;
  placeOrder(data: OrderType): Promise<OrderResponse | ErrorResponse>;
  getOrderBook(): Promise<OrderBook[] | ErrorResponse>;
  modifyOrder(data: MOrder): Promise<CancelOrderResponse | ErrorResponse>;
  cancelOrder(norenordno: string): Promise<CancelOrderResponse | ErrorResponse>;
  getPositionBook(): Promise<PositionBook[] | ErrorResponse>;
}
