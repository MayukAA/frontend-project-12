/* eslint-disable */

import axios from 'axios';
import { toast } from 'react-toastify';
import routes from './routes';
import { setChannels } from '../slices/channelsSlice';
import { setMessages } from '../slices/messagesSlice';

const dispatchData = (t, rollbar) => async (dispatch) => {
  const { token } = JSON.parse(localStorage.getItem('user'));
  try {
    const { data } = await axios.get(routes.dataPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { channels, messages } = data;

    dispatch(setChannels(channels));
    dispatch(setMessages(messages));
  } catch (error) {
    toast.error(t('dataLoadingError'));
    rollbar.error('ChatsPage: "dispatchData()" error');
  }
};

export default dispatchData;
