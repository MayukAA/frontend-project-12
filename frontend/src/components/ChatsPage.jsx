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
import { GoPlus, GoPaperAirplane, GoUnread } from 'react-icons/go';
import { useTranslation } from 'react-i18next';
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
  const [sendMessageError, setSendMessageError] = useState(false);
  const dispatch = useDispatch();
  const labelEl = useRef();
  const channelsContainerEl = useRef();
  const scrollChnlEl = useRef();
  const scrollMsgEl = useRef();
  const dayEl = useRef();
  const { t } = useTranslation();

  const { username } = currentUser;
  const { currentChannel, unreadChannels } = useSelector((state) => state.channelsUI);
  const channels = useSelector(selectorsChannels.selectAll);
  const channelsNames = channels.map((chnl) => chnl.name);
  const messages = useSelector(selectorsMessages.selectAll);
  const currentMessages = messages.filter((msg) => msg.channelId === currentChannel.id);
  const currentMessagesCount = currentMessages.filter((msg) => !msg.isService).length;

  const setCurrentChannel = (args) => dispatch(updateCurrentChannel(args));
  localStorage.setItem('unreadChannels', unreadChannels);

  useEffect(() => {
    setCurrentChannel({ status: 'init' });
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

    // для удаления значка непрочитанного сообщения;
    dispatch(resetUnreadChannel(currentChannel.id));
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

  const currDropdownClass = 'dropdown-toggle dropdown-toggle-split btn btn-dark pt-2';
  const notCurrDropdownClass = 'dropdown-toggle dropdown-toggle-split btn pt-2';
  const ownMsgClass = 'text-break text-end mb-1';
  const notOwnMsgClass = 'text-break mb-1';

  const getButtonChannel = ({ id, name }) => {
    const buttonChannelClass = cn('d-flex', 'justify-content-between', 'align-items-center', 'w-100', 'text-start', 'text-truncate', 'btn', {
      'btn-dark': id === currentChannel.id,
    });
    const iconClass = cn({
      'text-muted': id === currentChannel.id,
      'text-primary': unreadChannels.includes(id),
      'c-gray-500': !unreadChannels.includes(id),
    });

    return (
      <button
        type="button"
        className={buttonChannelClass}
        onClick={() => setCurrentChannel({ id, name, status: 'standart' })}
        ref={id === currentChannel.id ? scrollChnlEl : null}
      >
        <span># {name}</span>
        <GoUnread className={iconClass} />
      </button>
    );
  };

  const getServiceMessage = (id, isService, serviceData, date, i) => {
    if (isService === 'newDay') {
      return (
        <small key={id}>
          <div className="card rounded-5 bg-light text-muted text-center mx-auto mb-1" style={{ width: 'max-content' }}>
            <span
              className="px-3"
              ref={getFormattedDate(date, 'day') === getFormattedDate(new Date(), 'day') ? dayEl : null}
            >
              {getFormattedDate(date, 'day')}
            </span>
          </div>
        </small>
      );
    }

    const { oldName, newName } = serviceData;
    const body = isService === 'noticeAddChnl'
      ? t('serviceMessages.addChannel', { username: serviceData.username })
      : t('serviceMessages.renameChannel', { username: serviceData.username, oldName, newName });

    return (
      <div
        className="text-muted text-center mb-1"
        ref={(i + 1) === currentMessages.length ? scrollMsgEl : null}
        key={id}
      >
        {body}
        <span className="text-muted smallFont align-middle ms-5">{getFormattedDate(date, 'time')}</span>
      </div>
    );
  };

  return (
    <div className="container h-100 overflow-hidden rounded shadow my-4">
      <div className="row h-100 bg-white flex-md-row">
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
                        style={{ paddingBottom: '5px', paddingTop: '6px' }}
                        onClick={() => setCurrentModal(<RemoveChannelModal
                          socket={socket}
                          id={id}
                          name={name}
                        />)}
                      >
                        {t('remove')}
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        style={{ paddingBottom: '6px', paddingTop: '5px' }}
                        onClick={() => setCurrentModal(<RenameChannelModal
                          socket={socket}
                          id={id}
                          oldName={name}
                          channelsNames={channelsNames}
                        />)}
                      >
                        {t('chatsPage.rename')}
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
                {t('chatsPage.messagesCount.messages', { count: currentMessagesCount })}
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {(currentMessages.length > 0) && currentMessages.map(({
                body,
                id,
                author,
                isService,
                serviceData,
                date,
              }, i) => (
                isService ? getServiceMessage(id, isService, serviceData, date, i)
                  : (
                    <div
                      className={author === username ? ownMsgClass : notOwnMsgClass}
                      ref={(i + 1) === currentMessages.length ? scrollMsgEl : null}
                      key={id}
                    >
                      <b>{author}</b>
                      : {body}
                      <p className="text-muted smallFont">{getFormattedDate(date, 'time')}</p>
                    </div>
                  )
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <Formik
                initialValues={{ message: '' }}
                onSubmit={({ message }, { resetForm }) => {
                  // для сообщения с новой датой:
                  const date = new Date();
                  const day = getFormattedDate(date, 'day');
                  if (
                    currentMessages.length === 0
                    || !dayEl.current
                    || day !== dayEl.current.innerHTML
                  ) {
                    socket.emit('newMessage', { channelId: currentChannel.id, isService: 'newDay', date });
                  }

                  socket.emit('newMessage', {
                    body: message,
                    channelId: currentChannel.id,
                    author: username,
                    date: new Date(),
                  }, ({ status }) => {
                    if (status === 'ok') {
                      setSendMessageError(false);
                      resetForm();
                    } else {
                      setSendMessageError(true);
                    }
                  });
                  labelEl.current.focus();
                }}
              >
                {({ dirty }) => (
                  <Form className="py-1">
                    {sendMessageError && <div className="card bg-danger text-light mb-1 me-2 p-1 ps-2">{t('networkError')}</div>}
                    <div className="d-flex has-validation">
                      <Field
                        name="message"
                        aria-label={t('chatsPage.newMessage')}
                        placeholder={t('chatsPage.placeholder')}
                        id="message"
                        className="form-control border-secondary py-1 px-2 me-2"
                      />
                      <label htmlFor="message" ref={labelEl} />
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
