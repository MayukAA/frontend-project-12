/* eslint-disable */

import { createSlice, current } from '@reduxjs/toolkit';

const defaultCurrentChannel = { id: 1, name: 'general' };
const initialState = { currentChannel: defaultCurrentChannel };

const currentChannelSlice = createSlice({
  name: 'currentChannel',
  initialState,
  reducers: {
    updateCurrentChannel: (state, { payload }) => {
      const { id, name, status } = payload;
      const lastCurrChnl = current(state).currentChannel;

      switch (status) {
        case 'init':
          state.currentChannel = defaultCurrentChannel;
          break;
        case 'standart':
          state.currentChannel = { id, name };
          break;
        case 'fromRemoveChannel':
          if (id === lastCurrChnl.id) state.currentChannel = defaultCurrentChannel;
          break;
        case 'fromRenameChannel':
          if (id === lastCurrChnl.id) state.currentChannel = { id, name };
          break;
        default:
          return null;
      }
    },
  },
});

export const { updateCurrentChannel } = currentChannelSlice.actions;
export default currentChannelSlice.reducer;
