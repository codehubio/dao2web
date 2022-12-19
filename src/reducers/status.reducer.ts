import { createSlice } from '@reduxjs/toolkit'

export const statussSlice = createSlice({
  name: 'status',
  initialState: {
    isLoading: false,
  },
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
  }
});

export function isLoading(state: any) {
  return state.isLoading;
}

export const { setLoading } = statussSlice.actions

export default statussSlice.reducer