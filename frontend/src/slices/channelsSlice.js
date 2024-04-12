import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import fetchData from './thunkFetchData';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, { payload }) => {
      channelsAdapter.addMany(state, payload.channels);
    });
  },
});

export const selectorsChannels = channelsAdapter.getSelectors((state) => state.channels);
export const { addChannel, removeChannel, renameChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
