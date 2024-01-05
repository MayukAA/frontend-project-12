/* eslint-disable */

import '../styles.scss';
import '../index.css';
import 'bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GoPlus, GoPaperAirplane } from 'react-icons/go';
import { Formik, Field, Form } from 'formik';
import _ from 'lodash';

import dispatchData from '../utils/dispatchData';
import { selectorsChannels, updateChannel } from '../slices/channelsSlice';
import { selectorsMessages, addMessage } from '../slices/messagesSlice';

const ChatsPage = () => {
  const defaultCurrentChannelId = 1;
  const [currentChannelId, setCurrentChannelId] = useState(defaultCurrentChannelId);
  const labelEl = useRef();
  const dispatch = useDispatch();

  const channels = useSelector(selectorsChannels.selectAll);
  const currentChannel = useSelector((state) => selectorsChannels.selectById(state, currentChannelId));
  const messages = useSelector(selectorsMessages.selectAll);

  useEffect(() => {
    !currentChannel ? dispatch(dispatchData()) : labelEl.current.focus();
  }, [currentChannel]);

  const { username } = JSON.parse(localStorage.getItem('user'));
  const currentChannelClass = 'w-100 rounded-0 text-start btn btn-dark';
  const notCurrentChannelClass = 'w-100 rounded-0 text-start btn';

  if (currentChannel) {
    const currentMessagesIds = currentChannel.messages;

    return (
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 px-3 p-4">
              <b>Каналы</b>
              <button type="button" className="p-0 ms-1 text-primary btn btn-group-vertical">
                <GoPlus className="largeIcon" />
                <span className="visually-hidden">+</span>
              </button>
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels.map((channel) => (
                <li className="nav-item w-100" key={channel.id}>
                  <button
                    type="button"
                    className={channel.id === currentChannel.id ? currentChannelClass : notCurrentChannelClass}
                    onClick={() => setCurrentChannelId(channel.id)}
                  >
                    <span className="me-1">#</span>
                    {channel.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b># {currentChannel.name}</b>
                </p>
                <span className="text-muted">
                  {currentMessagesIds.length} сообщений
                </span>
              </div>
              <div id="messages-box" className="chat-messages overflow-auto px-5">
                {(currentMessagesIds.length > 0) && messages.map(({ message, id }) => (
                  currentMessagesIds.includes(id) && (
                    <div className="text-break mb-2" key={id}>
                      <b>{username}</b>
                      : {message}
                    </div>
                  )
                ))}
              </div>
              <div className="mt-auto px-5 py-3">
                <Formik
                  initialValues={{ message: '' }}
                  onSubmit={({ message }) => {
                    const id = _.uniqueId('message_');
                    dispatch(addMessage({ message, id, channel: currentChannel.name }));
                    dispatch(updateChannel({ id: currentChannel.id, changes: { messages: [...currentMessagesIds, id] }}));
                  }}
                >
                  {({ dirty }) => (
                    <Form className="py-1">
                      <div className="d-flex has-validation">
                        <Field name="message" aria-label="Новое сообщение" placeholder="Введите сообщение..." id="message" className="py-1 px-2 me-2 form-control border-dark" />
                        <label htmlFor="message" ref={labelEl} />
                        {dirty && (
                          <button type="submit" className="btn btn-group-vertical">
                            <GoPaperAirplane className="bigIcon" />
                            <span className="visually-hidden">Отправить</span>
                          </button>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatsPage;
