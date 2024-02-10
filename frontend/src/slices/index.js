import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import currentChannelReducer from './currentChannelSlice';
import unreadChannelsReducer from './unreadChannelsSlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    currentChannel: currentChannelReducer,
    unreadChannels: unreadChannelsReducer,
  },
});
