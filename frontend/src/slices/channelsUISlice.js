/* eslint-disable no-param-reassign */

import { createSlice, current } from '@reduxjs/toolkit';
import _ from 'lodash';
import { addMessage } from './messagesSlice';
import { removeChannel, renameChannel } from './channelsSlice';

const getIdsFromLocSt = () => localStorage.getItem('unreadChannels').split(',').map(Number);

const defaultChannel = { id: 1, name: 'general' };
const initialState = {
  currentChannel: defaultChannel,
  unreadChannels: localStorage.getItem('unreadChannels') ? getIdsFromLocSt() : [],
};

const channelsUISlice = createSlice({
  name: 'channelUI',
  initialState,
  reducers: {
    updateCurrentChannel: (state, { payload }) => {
      const { id, name, status } = payload;
      state.currentChannel = status === 'init' ? defaultChannel : { id, name };
    },
    resetUnreadChannel: (state, { payload }) => {
      _.pull(state.unreadChannels, payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMessage, (state, { payload }) => {
        const { channelId, isService } = payload;
        if (
          !_.includes(current(state).unreadChannels, channelId)
          && channelId !== current(state).currentChannel.id
          && !isService
        ) {
          state.unreadChannels = [...state.unreadChannels, channelId];
        }
      })
      .addCase(removeChannel, (state, { payload }) => {
        if (payload === current(state).currentChannel.id) state.currentChannel = defaultChannel;
        _.pull(state.unreadChannels, payload);
      })
      .addCase(renameChannel, (state, { payload }) => {
        const { id } = payload;
        const { name } = payload.changes;
        // to "instantly" rename the channel in the box above the messages:
        if (id === current(state).currentChannel.id) state.currentChannel = { id, name };
      });
  },
});

export const { updateCurrentChannel, resetUnreadChannel } = channelsUISlice.actions;
export default channelsUISlice.reducer;
