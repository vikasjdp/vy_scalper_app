import { NFOScript } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { ceScript: NFOScript | null; peScript: NFOScript | null } =
  {
    ceScript: null,
    peScript: null,
  };

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<NFOScript>) => {
      if (action.payload.optt === "CE") {
        state.ceScript = action.payload;
      } else {
        state.peScript = action.payload;
      }
    },
    updateScript: (state, action) => {
      if (state.ceScript != null) {
        if (state.ceScript.token === action.payload.token) {
          state.ceScript.ltp = action.payload.lp;
        }
      }
      if (state.peScript != null) {
        if (state.peScript.token === action.payload.token) {
          state.peScript.ltp = action.payload.lp;
        }
      }
    },
  },
});

export const { addToWatchlist, updateScript } = watchlistSlice.actions;

export default watchlistSlice.reducer;
