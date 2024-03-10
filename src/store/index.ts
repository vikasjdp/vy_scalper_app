import { configureStore } from "@reduxjs/toolkit";
import WatchlistReducer from "@/store/watchlistSlice";

export const store = configureStore({
  reducer: {
    watchlist: WatchlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
