import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  shopId: string | null;
}

const initialState: UserState = {
  userId: null,
  shopId: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setShopId: (state, action: PayloadAction<string | null>) => {
      state.shopId = action.payload;
    },
  },
});

export const { setUserId, setShopId } = userSlice.actions;

export default userSlice.reducer;
