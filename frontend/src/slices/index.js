import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import channelsUIReducer from './channelsUISlice';
import appStatusReducer from './appStatusSlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    channelsUI: channelsUIReducer,
    appStatus: appStatusReducer,
  },
});
