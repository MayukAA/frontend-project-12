/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import fetchData from './thunkFetchData';

const appStatusAdapter = createEntityAdapter();
const initialState = { appStatus: 'idle' };

const appStatusSlice = createSlice({
  name: 'appStatus',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.appStatus = 'loading';
      })
      .addCase(fetchData.fulfilled, (state) => {
        state.appStatus = 'idle';
      })
      .addCase(fetchData.rejected, (state) => {
        state.appStatus = 'failed';
      });
  },
});

export const selectorsChannels = appStatusAdapter.getSelectors((state) => state.appStatus);
export default appStatusSlice.reducer;
