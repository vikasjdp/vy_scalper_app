import { configureStore } from "@reduxjs/toolkit";
import WatchlistReducer from "@/store/watchlistSlice";
import OrderlistReducer from "@/store/orderSlice";
import PositionResducr from "@/store/positionSlice";

export const store = configureStore({
  reducer: {
    watchlist: WatchlistReducer,
    orderlist: OrderlistReducer,
    positionlist: PositionResducr,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
