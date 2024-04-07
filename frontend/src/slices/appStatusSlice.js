/* eslint-disable */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { setMessages } from './messagesSlice';

const appStatusAdapter = createEntityAdapter();
const initialState = { appStatus: 'loading' };

const appStatusSlice = createSlice({
  name: 'appStatus',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(setMessages, (state) => {
      state.appStatus = 'using';
    });
  },
});

export const selectorsChannels = appStatusAdapter.getSelectors((state) => state.appStatus);
export default appStatusSlice.reducer;
