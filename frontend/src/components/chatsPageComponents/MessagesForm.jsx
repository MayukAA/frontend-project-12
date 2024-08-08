import {
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GoPaperAirplane, GoX, GoCheck } from 'react-icons/go';
import {
  useFormikContext,
  Formik,
  Field,
  Form,
} from 'formik';
import cn from 'classnames';

import { AuthorizationContext, UtilsContext, StateContext } from '../../context/index';
import getFormattedDate from '../../utils/getFormattedDate';

const FieldTextComp = () => {
  const { textEditableMsg } = useContext(StateContext);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue('body', textEditableMsg);
  }, [textEditableMsg]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

const MessagesForm = () => {
  const { currentUser } = useContext(AuthorizationContext);
  const {
    socket,
    t,
    rollbar,
    currChnlMessages,
    dayEl,
  } = useContext(UtilsContext);
  const {
    isScrollBottom,
    setFieldSizeForScroll,
    msgEditingMode,
    textEditableMsg,
    idEditableMsg,
    btnDisabledNetworkWait,
    handleResetMsgEditingMode,
  } = useContext(StateContext);
  const [fieldText, setFieldText] = useState('');
  const labelEl = useRef();
  const textareaEl = useRef();
  const { currentChannel } = useSelector((state) => state.channelsUI);

  const { username } = currentUser;

  useEffect(() => {
    labelEl.current.focus();
  }, [currentChannel]);

  useEffect(() => {
    textareaEl.current.setAttribute('style', 'height: 2rem');

    const textareaHeight = textareaEl.current.scrollHeight + 2;
    textareaEl.current.setAttribute('style', `height: ${textareaHeight}px; resize: none`);

    if (isScrollBottom || msgEditingMode) setFieldSizeForScroll(textareaHeight);
  }, [fieldText]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    labelEl.current.focus();
  }, [textEditableMsg]);

  const formContainerClass = cn('mt-auto', 'border-top', 'px-5', {
    'py-3': !msgEditingMode,
    'pt-2': msgEditingMode,
    'pb-3': msgEditingMode,
  });

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
              }, ({ status }) => {
                if (status === 'ok') handleResetMsgEditingMode();
                else {
                  toast.error(t('networkError'));
                  rollbar.error('MessagesForm, message editing error');
                }
              });
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
            }, ({ status }) => {
              if (status === 'ok') resetForm();
              else {
                toast.error(t('networkError'));
                rollbar.error('MessagesForm, message sending error');
              }
            });
          }

          labelEl.current.focus();
        }}
      >
        {({ dirty, handleSubmit }) => (
          <Form className="py-1">
            <FieldTextComp />
            <div className="has-validation">
              <Field name="body">
                {({ field }) => (
                  <div className="d-flex w-100" onChange={setFieldText(field.value)}>
                    <label htmlFor="body" className="w-100 me-2" ref={labelEl}>
                      <textarea
                        name="body"
                        id="body"
                        className="form-control border-secondary px-2"
                        aria-label={t('chatsPage.newMessage')}
                        placeholder={t('chatsPage.placeholder')}
                        ref={textareaEl}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) handleSubmit();
                        }}
                        {...field}
                      />
                    </label>
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
        )}
      </Formik>
    </div>
  );
};

export default MessagesForm;
