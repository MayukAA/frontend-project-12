/* eslint-disable */

import axios from 'axios';
import routes from './routes';

import { setChannels } from '../slices/channelsSlice';
import { setMessages } from '../slices/messagesSlice';

const dispatchData = () => async (dispatch) => {
  const { token } = JSON.parse(localStorage.getItem('user'));
  const { data } = await axios.get(routes.dataPath(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const { channels, messages } = data;

  dispatch(setChannels(channels));
  dispatch(setMessages(messages));
};

export default dispatchData;
