import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import channelsUIReducer from './channelsUISlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    channelsUI: channelsUIReducer,
  },
});
