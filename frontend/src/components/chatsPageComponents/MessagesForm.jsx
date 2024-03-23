/* eslint-disable */

import {
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GoPaperAirplane, GoX, GoCheck } from 'react-icons/go';
import { Formik, Field, Form } from 'formik';
import cn from 'classnames';

import AuthorizationContext from '../../context/AuthorizationContext';
import UtilsContext from '../../context/UtilsContext';
import StateContext from '../../context/StateContext';
import getFormattedDate from '../../utils/getFormattedDate';

const MessagesForm = ({ dayEl }) => {
  const { currentUser } = useContext(AuthorizationContext);
  const { socket, currChnlMessages, t } = useContext(UtilsContext);
  const {
    isScrollBottom,
    setFieldSizeForScroll,
    msgEditingMode,
    setMsgEditingMode,
    textEditableMsg,
    setTextEditableMsg,
    idEditableMsg,
    setIdEditableMsg,
    btnDisabledNetworkWait,
  } = useContext(StateContext);
  const [fieldText, setFieldText] = useState('');
  const labelEl = useRef();
  const textareaEl = useRef();

  const { username } = currentUser;
  const { currentChannel } = useSelector((state) => state.channelsUI);

  useEffect(() => {
    labelEl.current.focus();
  }, [currentChannel]);

  useEffect(() => {
    textareaEl.current.setAttribute('style', 'height: 2rem');

    const textareaHeight = textareaEl.current.scrollHeight + 2;
    textareaEl.current.setAttribute('style', `height: ${textareaHeight}px; resize: none`);

    if (isScrollBottom || msgEditingMode) setFieldSizeForScroll(textareaHeight);
  }, [fieldText]);

  const formContainerClass = cn('mt-auto', 'border-top', 'px-5', {
    'py-3': !msgEditingMode,
    'pt-2': msgEditingMode,
    'pb-3': msgEditingMode,
  });

  const handleResetMsgEditingMode = () => {
    setTextEditableMsg('');
    setIdEditableMsg(null);
    setMsgEditingMode(false);
  };

  return (
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
  );
};

export default MessagesForm;
