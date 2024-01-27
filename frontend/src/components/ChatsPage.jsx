/* eslint-disable */

import '../styles.scss';
import '../index.css';
import 'bootstrap';
import {
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GoPlus, GoPaperAirplane } from 'react-icons/go';
import { Formik, Field, Form } from 'formik';
import io from 'socket.io-client';
import cn from 'classnames';

import AuthorizationContext from '../context/AuthorizationContext';
import dispatchData from '../utils/dispatchData';
import {
  selectorsChannels,
  addChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice';
import { selectorsMessages, addMessage } from '../slices/messagesSlice';
import AddChannelModal from './modals/AddChannelModal';
import RemoveChannelModal from './modals/RemoveChannelModal';
import RenameChannelModal from './modals/RenameChannelModal';

// const socket = io('ws://localhost:3000');
const socket = io('wss://hexlet-chat-spn2.onrender.com');

const ChatsPage = () => {
  const {
    currentUser,
    defaultCurrentChannel,
    currentChannel,
    setCurrentChannel,
    currentModal,
    setCurrentModal,
  } = useContext(AuthorizationContext);
  const [sendMessageError, setSendMessageError] = useState(false);
  const labelEl = useRef();
  const channelsContainerEl = useRef();
  const scrollChnlEl = useRef();
  const scrollMsgEl = useRef();
  const dispatch = useDispatch();

  const { username } = currentUser;
  const channels = useSelector(selectorsChannels.selectAll);
  const channelsNames = channels.map((chnl) => chnl.name);
  const messages = useSelector(selectorsMessages.selectAll);
  const currentMessages = messages.filter((msg) => msg.channelId === currentChannel.id);

  useEffect(() => {
    setCurrentChannel(defaultCurrentChannel);

    dispatch(dispatchData());

    socket.on('newMessage', (payload) => dispatch(addMessage(payload)));

    socket.on('newChannel', (payload) => dispatch(addChannel(payload)));

    socket.on('removeChannel', ({ id }) => dispatch(removeChannel(id)));

    socket.on('renameChannel', ({ id, name }) => dispatch(renameChannel({ id, changes: { name } })));
  }, []);

  useEffect(() => {
    labelEl.current.focus();

    // для исправления бага с незакрывающимся dropdown;
    const dropdownUlEl = document.querySelector('.dropdown-menu.show');
    if (dropdownUlEl) dropdownUlEl.classList.remove('show');
  }, [currentChannel]);

  useEffect(() => {
    if (scrollChnlEl.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && scrollChnlEl.current) {
          scrollChnlEl.current.scrollIntoView({ behavior: 'smooth' });
        }
      },
      {
        root: channelsContainerEl.current,
        threshold: 0.99,
      },
      );

      observer.observe(scrollChnlEl.current);
    }
  }, [scrollChnlEl.current]);

  useEffect(() => {
    if (scrollMsgEl.current) scrollMsgEl.current.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const currDropdownClass = 'dropdown-toggle dropdown-toggle-split btn btn-dark rounded-0';
  const notCurrDropdownClass = 'dropdown-toggle dropdown-toggle-split btn rounded-0';
  const ownMsgClass = 'text-break text-end mb-2';
  const notOwnMsgClass = 'text-break mb-2';

  const getButtonChannel = ({ id, name }) => {
    const buttonChannelClass = cn('w-100', 'rounded-0', 'text-start', 'text-truncate', 'btn', {
      'btn-dark': id === currentChannel.id,
    });

    return (
      <button
        type="button"
        className={buttonChannelClass}
        onClick={() => setCurrentChannel({ id, name })}
        ref={id === currentChannel.id ? scrollChnlEl : null}
      >
        <span className="me-1">#</span>
        {name}
      </button>
    );
  };

  return (
    <div className="container h-100 overflow-hidden rounded shadow my-4">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end bg-light flex-column h-100 d-flex px-0">
          <div className="d-flex justify-content-between p-4 px-3 mt-1 mb-2">
            <b>Каналы</b>
            <button
              type="button"
              className="text-primary btn btn-group-vertical p-0 ms-1"
              onClick={() => setCurrentModal(<AddChannelModal
                socket={socket}
                channelsNames={channelsNames}
              />)}
            >
              <GoPlus className="largeIcon" />
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill overflow-auto h-100 d-block px-2 mb-3" ref={channelsContainerEl}>
            {channels.map(({ id, name, removable }) => (removable ? (
              <li className="nav-item w-100" key={id}>
                <div role="group" className="d-flex dropdown btn-group">
                  {getButtonChannel({ id, name })}
                  <button
                    type="button"
                    className={id === currentChannel.id ? currDropdownClass : notCurrDropdownClass}
                    data-bs-toggle="dropdown"
                  >
                    <span className="visually-hidden">Управление каналом</span>
                  </button>
                  <ul className="dropdown-menu p-0">
                    <li>
                      <button
                        type="button"
                        className="dropdown-item pt-2 pb-1"
                        onClick={() => setCurrentModal(<RemoveChannelModal
                          socket={socket}
                          id={id}
                          name={name}
                        />)}
                      >
                        Удалить
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item pt-1 pb-2"
                        onClick={() => setCurrentModal(<RenameChannelModal
                          socket={socket}
                          id={id}
                          oldName={name}
                          channelsNames={channelsNames}
                        />)}
                      >
                        Переименовать
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            ) : (
              <li className="nav-item w-100" key={id}>
                {getButtonChannel({ id, name })}
              </li>
            )))}
          </ul>
        </div>
        <div className="col h-100 p-0">
          <div className="d-flex flex-column h-100">
            <div className="bg-light shadow-sm small p-3 mb-4">
              <p className="m-0">
                <b>
                  # {currentChannel.name}
                </b>
              </p>
              <span className="text-muted">
                {currentMessages.length} сообщений
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {(currentMessages.length > 0) && currentMessages.map(({ body, id, author }, index) => (
                <div
                  className={author === username ? ownMsgClass : notOwnMsgClass}
                  ref={(index + 1) === currentMessages.length ? scrollMsgEl : null}
                  key={id}
                >
                  <b>{author}</b>
                  : {body}
                </div>
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <Formik
                initialValues={{ message: '' }}
                onSubmit={({ message }) => {
                  socket.emit('newMessage', { body: message, channelId: currentChannel.id, author: username }, ({ status }) => {
                    status === 'ok' ? setSendMessageError(false) : setSendMessageError(true);
                  });
                  labelEl.current.focus();
                }}
              >
                {({ dirty }) => (
                  <Form className="py-1">
                    {sendMessageError && <div className="card bg-danger text-light mb-1 me-2 p-1 ps-2">Ошибка отправки сообщения!</div>}
                    <div className="d-flex has-validation">
                      <Field
                        name="message"
                        aria-label="Новое сообщение"
                        placeholder="Введите сообщение..."
                        id="message"
                        className="form-control border-secondary py-1 px-2 me-2"
                      />
                      <label htmlFor="message" ref={labelEl} />
                      <button type="submit" className="text-primary btn btn-group-vertical" disabled={!dirty}>
                        <GoPaperAirplane className="bigIcon" />
                        <span className="visually-hidden">Отправить</span>
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      {currentModal}
    </div>
  );
};

export default ChatsPage;
