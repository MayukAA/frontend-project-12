/* eslint-disable */

import '../styles.scss';
import '../index.css';
import 'bootstrap';
import { useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import ChannelsBox from '../components/chatsPageComponents/ChannelsBox';
import MessagesBoxHeader from '../components/chatsPageComponents/MessagesBoxHeader';
import MessagesBox from '../components/chatsPageComponents/MessagesBox';
import MessagesForm from '../components/chatsPageComponents/MessagesForm';

import UtilsContext from '../context/UtilsContext';
import StateContext from '../context/StateContext';
import dispatchData from '../utils/dispatchData';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsSlice';
import { addMessage } from '../slices/messagesSlice';

// const urlCheck = 'http://localhost:3000/';
const urlCheck = 'https://hexlet-chat-spn2.onrender.com/';
const urlToBackground = 'https://catherineasquithgallery.com/uploads/posts/2021-02/1614383788_11-p-fon-dlya-chata-v-vk-svetlii-12.jpg';

const ChatsPage = () => {
  const {
    socket,
    t,
    rollbar,
    setCurrentChannel,
  } = useContext(UtilsContext);
  const { currentModal, setBtnDisabledNetworkWait } = useContext(StateContext);
  const dispatch = useDispatch();
  const dayEl = useRef();
  const { unreadChannels } = useSelector((state) => state.channelsUI);

  localStorage.setItem('unreadChannels', unreadChannels);

  const checkConnection = async () => {
    try {
      await fetch(urlCheck);
      if (toast.isActive('customId')) toast.dismiss('customId');
      setBtnDisabledNetworkWait(false);
    } catch (err) {
      if (!toast.isActive('customId')) {
        toast.error(t('noInternetConnection'), { toastId: 'customId', autoClose: false });
      }
      setBtnDisabledNetworkWait(true);
      rollbar.error('ChatsPage: "checkConnection()" error');
    }
  };

  useEffect(() => {
    setCurrentChannel({ status: 'init' });
    dispatch(dispatchData(t, rollbar));

    socket.on('newMessage', (payload) => dispatch(addMessage(payload)));
    socket.on('newChannel', (payload) => dispatch(addChannel(payload)));
    socket.on('removeChannel', ({ id }) => dispatch(removeChannel(id)));
    socket.on('renameChannel', ({ id, name }) => dispatch(renameChannel({ id, changes: { name } })));

    checkConnection();
    const intervalId = setInterval(() => checkConnection(), 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container h-100 overflow-hidden rounded shadow my-4">
      <div
        className="row h-100 flex-md-row"
        style={{ backgroundImage: `url(${urlToBackground})`, backgroundSize: 'contain' }}
      >
        <ChannelsBox dispatch={dispatch} />
        <div className="d-flex flex-column col h-100 p-0">
          <MessagesBoxHeader />
          <MessagesBox dayEl={dayEl} />
          <MessagesForm dayEl={dayEl} />
        </div>
      </div>
      {currentModal}
    </div>
  );
};

export default ChatsPage;
