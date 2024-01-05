/* eslint-disable */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
});

export const selectorsMessages = messagesAdapter.getSelectors((state) => state.messages);
export const { setMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
