/* eslint-disable */

import axios from 'axios';
import routes from './routes';
import _ from 'lodash';

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

  // Добавление ключа messages в каналы:
  channels.map((channel) => channel.messages = []);

  // (!!!) Пока не стирать, т.к. на 5-м шаге, возможно, потребуется; (!!!)
  // Присвоение id сообщениям:
  // if (messages.length > 0) {
  //   messages.map((message) => {
  //     const id = _.uniqueId('message_');
  //     message.id = id;
  //   });
  // }

  // Добавление в channel.messages ключей сообщений:
  // if (messages.length > 0) {
  //   channels.map((channel) => {
  //     channel.messages = [];
  //     messages.map((message) => {
  //       if (message.channel === channel.name) {
  //         channel.messages.push(message.id);
  //       }
  //     });
  //   });
  // }
  // (!!!) Пока не стирать, т.к. на 5-м шаге, возможно, потребуется; (!!!)

  dispatch(setChannels(channels));
  dispatch(setMessages(messages));
};

export default dispatchData;
