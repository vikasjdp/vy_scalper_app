import { OrderBook } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { orders: OrderBook[] } = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    initOrderList: (state, action: PayloadAction<OrderBook[]>) => {
      state.orders = action.payload;
    },
    updateOrderLtp: (
      state,
      action: PayloadAction<{ token: string; lp: string }>
    ) => {
      state.orders.map((order) => {
        if (order.token === action.payload.token) {
          order.ltp = action.payload.lp;
        }
        return order;
      });
    },
    removeOrdrer: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order.norenordno !== action.payload
      );
    },
  },
});

export const { initOrderList, updateOrderLtp, removeOrdrer } =
  orderSlice.actions;

export default orderSlice.reducer;
