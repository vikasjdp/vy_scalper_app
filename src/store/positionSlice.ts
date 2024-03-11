import { PositionBook } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { positions: PositionBook[] } = {
  positions: [],
};

const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    initPosition: (state, action: PayloadAction<PositionBook[]>) => {
      state.positions = action.payload;
    },
    updatePositionLtp: (state, action) => {
      let p = state.positions.find((pos) => pos.token === action.payload.token);
      if (p) {
        p.lp = action.payload.lp;
      }
    },
  },
});

export const { initPosition, updatePositionLtp } = positionSlice.actions;

export default positionSlice.reducer;
