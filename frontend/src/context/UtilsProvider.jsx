/* eslint-disable */

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';

import UtilsContext from './UtilsContext';
import { updateCurrentChannel } from '../slices/channelsUISlice';
import { selectorsMessages } from '../slices/messagesSlice';

// const socket = io('ws://localhost:3000');
const socket = io('wss://hexlet-chat-spn2.onrender.com');

const UtilsProvider = ({ children }) => {
  const { currentChannel } = useSelector((state) => state.channelsUI);
  const messages = useSelector(selectorsMessages.selectAll);
  const currChnlMessages = messages.filter((msg) => msg.channelId === currentChannel.id);
  const currChnlUsersMsgsCount = currChnlMessages.filter((msg) => !msg.isService).length;

  const dispatch = useDispatch();
  const setCurrentChannel = (args) => dispatch(updateCurrentChannel(args));

  const { t } = useTranslation();

  return (
    <UtilsContext.Provider value={{
      socket,
      currentChannel,
      currChnlMessages,
      currChnlUsersMsgsCount,
      setCurrentChannel,
      t,
    }}>
      {children}
    </UtilsContext.Provider>
  );
};

export default UtilsProvider;
