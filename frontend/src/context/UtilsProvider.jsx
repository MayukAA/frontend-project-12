import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import io from 'socket.io-client';

import { UtilsContext } from './index';
import { updateCurrentChannel } from '../slices/channelsUISlice';
import { selectorsMessages } from '../slices/messagesSlice';

// const socket = io('ws://localhost:3000');
const socket = io('wss://hexlet-chat-spn2.onrender.com');

const UtilsProvider = ({ children }) => {
  const { currentChannel } = useSelector((state) => state.channelsUI);
  const messages = useSelector(selectorsMessages.selectAll);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const currChnlMessages = messages.filter((msg) => msg.channelId === currentChannel.id);
  const currChnlUsersMsgsCount = currChnlMessages.filter((msg) => !msg.isService).length;

  const setCurrentChannel = (args) => dispatch(updateCurrentChannel(args));

  const utils = useMemo(() => ({
    socket,
    currentChannel,
    t,
    rollbar,
    currChnlMessages,
    currChnlUsersMsgsCount,
    setCurrentChannel,
  }), [
    socket,
    currentChannel,
    t,
    rollbar,
    currChnlMessages,
    currChnlUsersMsgsCount,
    setCurrentChannel,
  ]);

  return (
    <UtilsContext.Provider value={utils}>
      {children}
    </UtilsContext.Provider>
  );
};

export default UtilsProvider;
