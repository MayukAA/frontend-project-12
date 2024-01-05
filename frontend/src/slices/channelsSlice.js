/* eslint-disable */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: channelsAdapter.addMany,
    updateChannel: channelsAdapter.updateOne,
  },
});

export const selectorsChannels = channelsAdapter.getSelectors((state) => state.channels);
export const { setChannels, updateChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
