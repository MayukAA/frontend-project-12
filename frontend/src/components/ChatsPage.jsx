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
  GoMail,
  GoTrash,
  GoPencil,
  GoX,
  GoCheck,
} from 'react-icons/go';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Formik, Field, Form } from 'formik';
import io from 'socket.io-client';
import cn from 'classnames';
import _ from 'lodash';

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
import RemoveMessageModal from './modals/RemoveMessageModal';

// const socket = io('ws://localhost:3000');
// const checkUrl = 'http://localhost:3000/';
const socket = io('wss://hexlet-chat-spn2.onrender.com');
const checkUrl = 'https://hexlet-chat-spn2.onrender.com/';
const urlToBackground = 'https://catherineasquithgallery.com/uploads/posts/2021-02/1614383788_11-p-fon-dlya-chata-v-vk-svetlii-12.jpg';

const ChatsPage = () => {
  const {
    currentUser,
    currentModal,
    setCurrentModal,
    btnDisabledNetworkWait,
    setBtnDisabledNetworkWait,
    getFormattedDate,
  } = useContext(AuthorizationContext);
  const [fieldText, setFieldText] = useState('');
  const [textEditableMsg, setTextEditableMsg] = useState('');
  const [idEditableMsg, setIdEditableMsg] = useState(null);
  const [msgEditingMode, setMsgEditingMode] = useState(false);
  const [fieldSizeForScroll, setFieldSizeForScroll] = useState('');
  const [isScrollBottom, setIsScrollBottom] = useState(true);
  const dispatch = useDispatch();
  const labelEl = useRef();
  const channelsContainerEl = useRef();
  const messagesContainerEl = useRef();
  const scrollChnlEl = useRef();
  const msgBoxBottom = useRef();
  const dayEl = useRef();
  const textareaEl = useRef();
  const editableMsgEl = useRef();
  const { t } = useTranslation();

  const { username } = currentUser;
  const channels = useSelector(selectorsChannels.selectAll);
  const channelsNames = channels.map((chnl) => chnl.name);
  const { currentChannel, unreadChannels } = useSelector((state) => state.channelsUI);
  const messages = useSelector(selectorsMessages.selectAll);
  const currChnlMessages = messages.filter((msg) => msg.channelId === currentChannel.id);
  const currChnlUsersMsgsCount = currChnlMessages.filter((msg) => !msg.isService).length;
  const currChnlRemovedMsgsIds = currChnlMessages
    .filter((msg) => msg.isService && msg.isService.root === 'removeMsg')
    .map((msg) => msg.isService.data.msgId);
  const currChnlEditedMsgs = currChnlMessages.reduce((acc, msg) => {
    if (msg.isService && msg.isService.root === 'editMsg') {
      acc[msg.isService.data.msgId] = msg.isService.data.newText;
    }
    return acc;
  }, {});

  const setCurrentChannel = (args) => dispatch(updateCurrentChannel(args));
  localStorage.setItem('unreadChannels', unreadChannels);

  const checkConnection = async () => {
    try {
      await fetch(checkUrl);
      if (toast.isActive('customId')) toast.dismiss('customId');
      setBtnDisabledNetworkWait(false);
    } catch (err) {
      if (!toast.isActive('customId')) {
        toast.error(t('noInternetConnection'), { toastId: 'customId', autoClose: false });
      }
      setBtnDisabledNetworkWait(true);
    }
  };

  useEffect(() => {
    setCurrentChannel({ status: 'init' });
    dispatch(dispatchData(t));
    socket.on('newMessage', (payload) => dispatch(addMessage(payload)));
    socket.on('newChannel', (payload) => dispatch(addChannel(payload)));
    socket.on('removeChannel', ({ id }) => dispatch(removeChannel(id)));
    socket.on('renameChannel', ({ id, name }) => dispatch(renameChannel({ id, changes: { name } })));

    checkConnection();
    const intervalId = setInterval(() => checkConnection(), 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    labelEl.current.focus();
    msgBoxBottom.current.scrollIntoView({ behavior: 'smooth' });

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
    if (!msgEditingMode) {
      const lastMsgCurrChnl = currChnlMessages.at(-1);
      const isOwnMsg = lastMsgCurrChnl && lastMsgCurrChnl.author === username;

      if (isScrollBottom || isOwnMsg) {
        msgBoxBottom.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currChnlUsersMsgsCount, fieldSizeForScroll]);

  useEffect(() => {
    if (msgEditingMode) {
      const observer = new IntersectionObserver(() => {
        if (editableMsgEl.current) {
          editableMsgEl.current.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
        }
      },
      { root: messagesContainerEl.current, threshold: 0.99 },
      );

      observer.observe(editableMsgEl.current);
    }
  }, [idEditableMsg, fieldSizeForScroll]);

  useEffect(() => {
    textareaEl.current.setAttribute('style', 'height: 2rem');

    const textareaHeight = textareaEl.current.scrollHeight + 2;
    textareaEl.current.setAttribute('style', `height: ${textareaHeight}px; resize: none`);

    if (isScrollBottom || msgEditingMode) setFieldSizeForScroll(textareaHeight);
  }, [fieldText]);

  const getStyleSvg = () => ({ paddingTop: '1px', minWidth: '1.15rem', minHeight: '1.15rem' });
  const currDropdownCls = 'dropdown-toggle dropdown-toggle-split btn-chnl btn btn-dark pt-2';
  const notCurrDropdownCls = 'dropdown-toggle dropdown-toggle-split btn-chnl btn pt-2';
  const formContainerClass = cn('mt-auto', 'border-top', 'px-5', {
    'py-3': !msgEditingMode,
    'pt-2': msgEditingMode,
    'pb-3': msgEditingMode,
  });
  const marginForMsgMenu = '3.44rem';

  const getButtonChannel = ({ id, name }) => {
    const isCurrentChannel = id === currentChannel.id;
    const isUnreadChannel = unreadChannels.includes(id);
    const buttonChannelClass = cn('d-flex', 'w-100', 'btn', 'btn-chnl', 'align-items-center', 'justify-content-between', 'text-start', 'text-truncate', {
      'btn-dark': isCurrentChannel,
    });

    return (
      <button
        type="button"
        className={buttonChannelClass}
        onClick={() => setCurrentChannel({ id, name, status: 'standart' })}
        ref={isCurrentChannel ? scrollChnlEl : null}
      >
        <span className="text-truncate me-1">
          {'# '}
          {name}
        </span>
        {isUnreadChannel
          ? <GoUnread className="text-dark" style={{ minWidth: '1rem' }} />
          : <GoMail className={isCurrentChannel ? 'text-muted' : 'c-gray-500'} style={{ minWidth: '1rem' }} />}
      </button>
    );
  };

  const getServiceMessage = (id, isService, date) => {
    if (isService.root === 'newDay') {
      const isToday = getFormattedDate(date, 'day') === getFormattedDate(new Date(), 'day');

      return (
        <small key={id}>
          <div className="card mx-auto rounded-5 opacity-75 text-muted text-center mb-2" style={{ maxWidth: 'max-content' }}>
            <span className="px-3" ref={isToday ? dayEl : null}>
              {getFormattedDate(date, 'day')}
            </span>
          </div>
        </small>
      );
    }

    if (isService.root === 'noticeAddChannel' || isService.root === 'noticeRenameChannel') {
      const { data } = isService;
      const { oldName, newName } = data;
      const body = isService.root === 'noticeAddChannel'
        ? t('serviceMessages.addChannel', { username: data.username })
        : t('serviceMessages.renameChannel', { username: data.username, oldName, newName });

      return (
        <div
          className="card mx-auto rounded-5 opacity-75 text-muted text-center mb-2"
          style={{ maxWidth: 'max-content' }}
          key={id}
        >
          <div className="px-3">
            <span className="me-5">{body}</span>
            <span className="text-muted smallFont">{getFormattedDate(date, 'time')}</span>
          </div>
        </div>
      );
    }
  };

  const getUserMessage = (body, id, author, date) => {
    const isOwnMsg = author === username;
    const isRemovedMsg = currChnlRemovedMsgsIds.includes(id);
    const isEditedMsg = Object.hasOwn(currChnlEditedMsgs, id);
    const isEditableMsg = id === idEditableMsg;
    const green = '#198754';

    const msgPositionClass = cn('w-75', { 'ms-auto': isOwnMsg, 'pe-5': isOwnMsg });
    const msgCardClass = cn('card', 'rounded-3', 'mb-2', 'px-2', 'py-1', {
      'not-own-msg-card': !isOwnMsg,
      'own-msg-card': isOwnMsg,
      'ms-auto': isOwnMsg,
      'text-end': isOwnMsg,
      'bg-dark': isOwnMsg,
      'text-light': isOwnMsg,
    });
    const msgTextClass = cn('m-0', {
      'text-start': isOwnMsg,
      'text-muted': isRemovedMsg,
      'fst-italic': isRemovedMsg,
    });

    const getStyleMsg = () => (isEditableMsg
      ? { maxWidth: 'max-content', borderLeftWidth: 'thick', borderLeftColor: green }
      : { maxWidth: 'max-content' });

    const handleEditButton = () => {
      setIdEditableMsg(id);
      setTextEditableMsg(isEditedMsg ? currChnlEditedMsgs[id] : body);
      setMsgEditingMode(true);
    };

    const getTextWithParagraphs = (text) => text.split('\n').map((paragraph) => (
      <p className="m-0" key={_.uniqueId('key_')}>{paragraph}</p>
    ));

    const getMsgBody = () => {
      if (isRemovedMsg) return t('chatsPage.messageDeleted');
      if (isEditedMsg) return getTextWithParagraphs(currChnlEditedMsgs[id]);

      return getTextWithParagraphs(body);
    };

    return (
      <div
        className={msgPositionClass}
        ref={isEditableMsg ? editableMsgEl : null}
        key={id}
      >
        <div className={msgCardClass} style={getStyleMsg()}>
          <p className="m-0">
            <b className="me-2">{author}</b>
            <span className="text-muted smallFont m-0">{getFormattedDate(date, 'time')}</span>
          </p>
          <div className={msgTextClass}>{getMsgBody()}</div>
          {(isEditedMsg && !isRemovedMsg) && (
            <div className="d-flex ms-auto">
              <GoPencil className="text-muted me-1" />
              <p className="text-muted smallFont m-0">{t('chatsPage.edited')}</p>
            </div>
          )}
          {(isOwnMsg && !isRemovedMsg) && (
            <div>
              <button
                type="button"
                className="btn btn-sm btn-msg-menu text-primary rounded-3"
                style={{ paddingInline: '5px' }}
                data-bs-toggle="dropdown"
              >
                <BsThreeDotsVertical className="bigIcon" />
                <span className="visually-hidden">{t('chatsPage.management')}</span>
              </button>
              <ul className="dropdown-menu p-0" style={{ minWidth: '9rem' }}>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    style={{ paddingBottom: '5px', paddingTop: '6px', paddingLeft: '12px' }}
                    onClick={() => setCurrentModal(<RemoveMessageModal
                      socket={socket}
                      id={id}
                      currentChannelId={currentChannel.id}
                    />)}
                  >
                    <div className="d-flex align-items-center">
                      <GoTrash className="text-danger me-2" style={getStyleSvg()} />
                      <span>{t('remove')}</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    style={{ paddingBottom: '6px', paddingTop: '5px', paddingLeft: '12px' }}
                    onClick={handleEditButton}
                  >
                    <div className="d-flex align-items-center">
                      <GoPencil className="text-muted me-2" style={getStyleSvg()} />
                      <span>{t('chatsPage.edit')}</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleResetMsgEditingMode = () => {
    setTextEditableMsg('');
    setIdEditableMsg(null);
    setMsgEditingMode(false);
  };

  const handleScroll = () => {
    const smallMarginPx = 25;
    const { scrollTop, clientHeight, scrollHeight } = messagesContainerEl.current;
    const scrollPos = scrollHeight % (scrollTop + clientHeight);

    setIsScrollBottom(scrollPos < smallMarginPx || (scrollTop + clientHeight) > scrollHeight);
  };

  return (
    <div className="container h-100 overflow-hidden rounded shadow my-4">
      <div
        className="row h-100 flex-md-row"
        style={{ backgroundImage: `url(${urlToBackground})`, backgroundSize: 'contain' }}
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
          <ul
            id="channels-box"
            className="nav flex-column nav-pills nav-fill overflow-auto h-100 d-block px-2 mb-3"
            ref={channelsContainerEl}
          >
            {channels.map(({ id, name, removable }) => (removable
              ? (
                <li className="nav-item w-100" key={id}>
                  <div role="group" className="d-flex dropdown btn-group">
                    {getButtonChannel({ id, name })}
                    <button
                      type="button"
                      className={id === currentChannel.id ? currDropdownCls : notCurrDropdownCls}
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
                            <GoTrash className="text-danger me-2" style={getStyleSvg()} />
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
                            <GoPencil className="text-muted me-2" style={getStyleSvg()} />
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
              )
            ))}
          </ul>
        </div>
        <div className="col h-100 p-0">
          <div className="d-flex flex-column h-100">
            <div className="bg-light shadow-sm small p-3 mb-3">
              <p className="m-0">
                <b>
                  {'# '}
                  {currentChannel.name}
                </b>
              </p>
              <span className="text-muted">
                {t('chatsPage.messagesCount.messages', { count: currChnlUsersMsgsCount })}
              </span>
            </div>
            <div
              id="messages-box"
              className="chat-messages overflow-auto ps-5"
              style={{ paddingBottom: currChnlUsersMsgsCount === 1 ? marginForMsgMenu : null }}
              ref={messagesContainerEl}
              onScroll={handleScroll}
            >
              {(currChnlMessages.length > 0) && currChnlMessages.map(({
                body,
                id,
                author,
                isService,
                date,
              }) => (isService
                ? getServiceMessage(id, isService, date)
                : getUserMessage(body, id, author, date)
              ))}
              <div ref={msgBoxBottom} />
            </div>
            <div className={formContainerClass}>
              {msgEditingMode && (
                <div className="d-flex mb-1">
                  <div className="card bg-success opacity-75 text-light w-100 ps-2 me-2">
                    <span className="my-1">{t('chatsPage.editMessage')}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger hov-opac-75 btn-group-vertical ms-auto py-1"
                    aria-label="reset"
                    onClick={handleResetMsgEditingMode}
                  >
                    <GoX className="middleIcon" />
                  </button>
                </div>
              )}
              <Formik
                initialValues={{ body: '' }}
                onSubmit={({ body }, { resetForm }) => {
                  if (msgEditingMode) {
                    if (body === textEditableMsg) handleResetMsgEditingMode();
                    else {
                      socket.emit('newMessage', {
                        channelId: currentChannel.id,
                        isService: {
                          root: 'editMsg',
                          data: { msgId: idEditableMsg, newText: body },
                        },
                      }, ({ status }) => (status === 'ok' ? handleResetMsgEditingMode() : toast.error(t('networkError'))));
                    }
                  } else {
                    const date = new Date();
                    const day = getFormattedDate(date, 'day');
                    if (
                      currChnlMessages.length === 0
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
                    }, ({ status }) => (status === 'ok' ? resetForm() : toast.error(t('networkError'))));
                  }

                  labelEl.current.focus();
                }}
              >
                {({ dirty, setFieldValue }) => {
                  useEffect(() => {
                    setFieldValue('body', textEditableMsg);
                    labelEl.current.focus();
                  }, [textEditableMsg]);

                  return (
                    <Form className="py-1">
                      <div className="d-flex has-validation">
                        <Field name="body">
                          {({ field }) => (
                            <div className="d-flex w-100" onChange={setFieldText(field.value)}>
                              <textarea
                                name="body"
                                id="body"
                                className="form-control border-secondary px-2 me-2"
                                aria-label={t('chatsPage.newMessage')}
                                placeholder={t('chatsPage.placeholder')}
                                ref={textareaEl}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') e.target += '\n';
                                }}
                                {...field}
                              />
                              <label htmlFor="body" ref={labelEl} />
                              {msgEditingMode
                                ? (
                                  <button type="submit" className="btn btn-outline-success hov-opac-75 btn-group-vertical" disabled={!dirty || btnDisabledNetworkWait}>
                                    <GoCheck className="middleIcon" />
                                    <span className="visually-hidden">{t('chatsPage.edit')}</span>
                                  </button>
                                ) : (
                                  <button type="submit" className="btn btn-outline-primary hov-opac-75 btn-group-vertical" disabled={!dirty || btnDisabledNetworkWait}>
                                    <GoPaperAirplane className="middleIcon" />
                                    <span className="visually-hidden">{t('send')}</span>
                                  </button>
                                )}
                            </div>
                          )}
                        </Field>
                      </div>
                    </Form>
                  );
                }}
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
