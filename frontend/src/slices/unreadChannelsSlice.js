/* eslint-disable */

import { createSlice, current } from '@reduxjs/toolkit';
import _ from 'lodash';
import { updateCurrentChannel } from './currentChannelSlice';

const initialState = { unreadChannels: [] };

const unreadChannelsSlice = createSlice({
  name: 'unreadChannels',
  initialState,
  reducers: {
    addUnreadChannel: (state, { payload }) => {
      if (!_.includes(current(state).unreadChannels, payload)) {
        state.unreadChannels = [...state.unreadChannels, payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCurrentChannel, (state, { payload }) => {
      _.pull(state.unreadChannels, payload.id);
    });
  },
});

export const { addUnreadChannel } = unreadChannelsSlice.actions;
export default unreadChannelsSlice.reducer;
