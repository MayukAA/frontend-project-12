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
import {
  GoPlus,
  GoPaperAirplane,
  GoUnread,
  GoTrash,
  GoPencil,
} from 'react-icons/go';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useOnline } from '@react-hooks-library/core';
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
import { updateCurrentChannel, resetUnreadChannel } from '../slices/channelsUISlice';
import AddChannelModal from './modals/AddChannelModal';
import RemoveChannelModal from './modals/RemoveChannelModal';
import RenameChannelModal from './modals/RenameChannelModal';

// const socket = io('ws://localhost:3000');
const socket = io('wss://hexlet-chat-spn2.onrender.com');

const ChatsPage = () => {
  const {
    currentUser,
    currentModal,
    setCurrentModal,
    getFormattedDate,
  } = useContext(AuthorizationContext);
  const dispatch = useDispatch();
  const [prevConnectionState, setPrevConnectionState] = useState(false);
  const labelEl = useRef();
  const channelsContainerEl = useRef();
  const scrollChnlEl = useRef();
  const scrollMsgEl = useRef();
  const dayEl = useRef();
  const toastEl = useRef();
  const { t } = useTranslation();
  const isOnline = useOnline();

  const { username } = currentUser;
  const channels = useSelector(selectorsChannels.selectAll);
  const channelsNames = channels.map((chnl) => chnl.name);
  const { currentChannel, unreadChannels } = useSelector((state) => state.channelsUI);
  const messages = useSelector(selectorsMessages.selectAll);
  const currentMessages = messages.filter((msg) => msg.channelId === currentChannel.id);
  const currentMessagesCount = currentMessages.filter((msg) => !msg.isService).length;

  const setCurrentChannel = (args) => dispatch(updateCurrentChannel(args));
  localStorage.setItem('unreadChannels', unreadChannels);

  useEffect(() => {
    setCurrentChannel({ status: 'init' });
    dispatch(dispatchData(t));
    socket.on('newMessage', (payload) => dispatch(addMessage(payload)));
    socket.on('newChannel', (payload) => dispatch(addChannel(payload)));
    socket.on('removeChannel', ({ id }) => dispatch(removeChannel(id)));
    socket.on('renameChannel', ({ id, name }) => dispatch(renameChannel({ id, changes: { name } })));
  }, []);

  useEffect(() => {
    labelEl.current.focus();

    // исправление бага с незакрывающимся dropdown;
    const dropdownUlEl = document.querySelector('.dropdown-menu.show');
    if (dropdownUlEl) dropdownUlEl.classList.remove('show');

    // удаление значка непрочитанного сообщения;
    dispatch(resetUnreadChannel(currentChannel.id));
  }, [currentChannel]);

  useEffect(() => {
    if (scrollChnlEl.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && scrollChnlEl.current) {
          scrollChnlEl.current.scrollIntoView({ behavior: 'smooth' });
        }
      },
      { root: channelsContainerEl.current, threshold: 0.99 },
      );

      observer.observe(scrollChnlEl.current);
    }
  }, [scrollChnlEl.current]);

  useEffect(() => {
    if (scrollMsgEl.current) scrollMsgEl.current.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    if (!isOnline && prevConnectionState) {
      toastEl.current = toast.error(t('noInternetConnection'), { autoClose: false });
    }
    if (isOnline) toast.dismiss(toastEl.current);

    setPrevConnectionState(isOnline);
  }, [isOnline]);

  const currDropdownClass = 'dropdown-toggle dropdown-toggle-split btn btn-dark pt-2';
  const notCurrDropdownClass = 'dropdown-toggle dropdown-toggle-split btn pt-2';

  const getButtonChannel = ({ id, name }) => {
    const isCurrentChannel = id === currentChannel.id;
    const buttonChannelClass = cn('d-flex', 'justify-content-between', 'align-items-center', 'w-100', 'text-start', 'text-truncate', 'btn', {
      'btn-dark': isCurrentChannel,
    });
    const iconClass = cn({
      'text-muted': isCurrentChannel,
      'text-primary': unreadChannels.includes(id),
      'c-gray-500': !unreadChannels.includes(id) && !isCurrentChannel,
    });

    return (
      <button
        type="button"
        className={buttonChannelClass}
        onClick={() => setCurrentChannel({ id, name, status: 'standart' })}
        ref={isCurrentChannel ? scrollChnlEl : null}
      >
        <span className="text-truncate me-1"># {name}</span>
        <GoUnread className={iconClass} style={{ minWidth: '1rem' }} />
      </button>
    );
  };

  const getServiceMessage = (id, isService, date, i) => {
    if (isService.root === 'newDay') {
      const isToday = getFormattedDate(date, 'day') === getFormattedDate(new Date(), 'day');

      return (
        <small key={id}>
          <div className="card rounded-5 opacity-75 text-muted text-center mx-auto mb-2" style={{ maxWidth: 'max-content' }}>
            <span className="px-3" ref={isToday ? dayEl : null}>
              {getFormattedDate(date, 'day')}
            </span>
          </div>
        </small>
      );
    }

    const { data } = isService;
    const { oldName, newName } = data;
    const body = isService.root === 'noticeAddChnl'
      ? t('serviceMessages.addChannel', { username: data.username })
      : t('serviceMessages.renameChannel', { username: data.username, oldName, newName });
    const isLastMessage = (i + 1) === currentMessages.length;

    return (
      <div
        className="card rounded-5 opacity-75 text-muted text-center mx-auto mb-2"
        style={{ maxWidth: 'max-content' }}
        ref={isLastMessage ? scrollMsgEl : null}
        key={id}
      >
        <div className="px-3">
          <span className="me-5">{body}</span>
          <span className="text-muted smallFont">{getFormattedDate(date, 'time')}</span>
        </div>
      </div>
    );
  };

  const getUserMessage = (body, id, author, date, i) => {
    const isLastMessage = (i + 1) === currentMessages.length;
    const isOwnMsg = author === username;
    const msgPositionClass = cn('w-75', { 'ms-auto': isOwnMsg });
    const msgCardClass = cn('card', 'rounded-3', 'mb-2', 'px-2', 'py-1', {
      'not-own-msg-card': !isOwnMsg,
      'own-msg-card': isOwnMsg,
      'ms-auto': isOwnMsg,
      'text-end': isOwnMsg,
      'bg-dark': isOwnMsg,
      'text-light': isOwnMsg,
    });
    const msgTextPositionClass = cn('m-0', { 'text-start': isOwnMsg });

    return (
      <div
        className={msgPositionClass}
        ref={isLastMessage ? scrollMsgEl : null}
        key={id}
      >
        <div className={msgCardClass} style={{ maxWidth: 'max-content' }}>
          <p className="m-0">
            <b className="me-2">{author}</b>
            <span className="text-muted smallFont m-0">{getFormattedDate(date, 'time')}</span>
          </p>
          <p className={msgTextPositionClass}>{body}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container h-100 overflow-hidden rounded shadow my-4">
      <div
        className="row h-100 flex-md-row"
        style={{
          backgroundImage: "url('https://catherineasquithgallery.com/uploads/posts/2021-02/1614383788_11-p-fon-dlya-chata-v-vk-svetlii-12.jpg')",
          backgroundSize: 'contain',
        }}
      >
        <div className="col-4 col-md-2 border-end bg-light flex-column h-100 d-flex px-0">
          <div className="d-flex justify-content-between p-4 px-3 mt-1 mb-2">
            <b>{t('chatsPage.channels')}</b>
            <button
              type="button"
              className="text-primary btn btn-group-vertical p-0 ms-1"
              onClick={() => setCurrentModal(<AddChannelModal
                socket={socket}
                setCurrentChannel={setCurrentChannel}
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
                    <span className="visually-hidden">{t('chatsPage.management')}</span>
                  </button>
                  <ul className="dropdown-menu p-0" style={{ minWidth: '9rem' }}>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        style={{ paddingBottom: '5px', paddingTop: '6px', paddingLeft: '12px' }}
                        onClick={() => setCurrentModal(<RemoveChannelModal
                          socket={socket}
                          id={id}
                          name={name}
                        />)}
                      >
                        <div className="d-flex align-items-center">
                          <GoTrash className="text-muted me-2" style={{ paddingTop: '1px', minWidth: '1.15rem', minHeight: '1.15rem' }} />
                          <span>{t('remove')}</span>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        style={{ paddingBottom: '6px', paddingTop: '5px', paddingLeft: '12px' }}
                        onClick={() => setCurrentModal(<RenameChannelModal
                          socket={socket}
                          id={id}
                          oldName={name}
                          channelsNames={channelsNames}
                        />)}
                      >
                        <div className="d-flex align-items-center">
                          <GoPencil className="text-muted me-2" style={{ paddingTop: '1px', minWidth: '1.15rem', minHeight: '1.15rem' }} />
                          <span>{t('chatsPage.rename')}</span>
                        </div>
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
            <div className="bg-light shadow-sm small p-3 mb-3">
              <p className="m-0">
                <b>
                  # {currentChannel.name}
                </b>
              </p>
              <span className="text-muted">
                {t('chatsPage.messagesCount.messages', { count: currentMessagesCount })}
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-4">
              {(currentMessages.length > 0) && currentMessages.map(({
                body,
                id,
                author,
                isService,
                date,
              }, i) => (isService
                ? getServiceMessage(id, isService, date, i)
                : getUserMessage(body, id, author, date, i)
              ))}
            </div>
            <div className="mt-auto border-top px-5 py-3">
              <Formik
                initialValues={{ body: '' }}
                onSubmit={({ body }, { resetForm }) => {
                  // сообщение с новой датой:
                  const date = new Date();
                  const day = getFormattedDate(date, 'day');
                  if (
                    currentMessages.length === 0
                    || !dayEl.current
                    || day !== dayEl.current.innerHTML
                  ) {
                    socket.emit('newMessage', { channelId: currentChannel.id, isService: { root: 'newDay' }, date });
                  }

                  socket.emit('newMessage', {
                    body,
                    channelId: currentChannel.id,
                    author: username,
                    date: new Date(),
                  }, ({ status }) => {
                    status === 'ok' ? resetForm() : toast.error(t('networkError'));
                  });

                  labelEl.current.focus();
                }}
              >
                {({ dirty }) => (
                  <Form className="py-1">
                    <div className="d-flex has-validation">
                      <Field
                        name="body"
                        aria-label={t('chatsPage.newMessage')}
                        placeholder={t('chatsPage.placeholder')}
                        id="body"
                        className="form-control border-secondary py-1 px-2 me-2"
                      />
                      <label htmlFor="body" ref={labelEl} />
                      <button type="submit" className="text-primary btn btn-group-vertical" disabled={!dirty}>
                        <GoPaperAirplane className="middleIcon" />
                        <span className="visually-hidden">{t('send')}</span>
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
