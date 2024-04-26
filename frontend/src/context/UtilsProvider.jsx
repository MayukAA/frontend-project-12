import { useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import io from 'socket.io-client';

import { UtilsContext } from './index';
import { updateCurrentChannel } from '../slices/channelsUISlice';
import { selectorsMessages } from '../slices/messagesSlice';

const socket = io();

const UtilsProvider = ({ children }) => {
  const { currentChannel } = useSelector((state) => state.channelsUI);
  const messages = useSelector(selectorsMessages.selectAll);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const currChnlMessages = messages.filter((msg) => msg.channelId === currentChannel.id);
  const currChnlUsersMsgsCount = currChnlMessages.filter((msg) => !msg.isService).length;

  const setCurrentChannel = (args) => dispatch(updateCurrentChannel(args));

  const dayEl = useRef();
  const editableMsgEl = useRef();
  const scrollChnlEl = useRef();

  const utils = useMemo(() => ({
    socket,
    currentChannel,
    t,
    rollbar,
    currChnlMessages,
    currChnlUsersMsgsCount,
    setCurrentChannel,
    dayEl,
    editableMsgEl,
    scrollChnlEl,
  }), [
    socket,
    currentChannel,
    t,
    rollbar,
    currChnlMessages,
    currChnlUsersMsgsCount,
    setCurrentChannel,
    dayEl,
    editableMsgEl,
    scrollChnlEl,
  ]);

  return (
    <UtilsContext.Provider value={utils}>
      {children}
    </UtilsContext.Provider>
  );
};

export default UtilsProvider;
