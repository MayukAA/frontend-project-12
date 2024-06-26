/* eslint-disable no-param-reassign */

import {
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Formik, Field, Form } from 'formik';
import cn from 'classnames';
import leoProfanity from 'leo-profanity';

import { AuthorizationContext, UtilsContext, StateContext } from '../../context/index';
import { getModalSchema } from '../../utils/validationSchemas';

const RenameChannelModal = ({ id, oldName, channelsNames }) => {
  const { currentUser } = useContext(AuthorizationContext);
  const { socket, t, rollbar } = useContext(UtilsContext);
  const { setCurrentModal, btnDisabledNetworkWait } = useContext(StateContext);
  const [invalidForm, setInvalidForm] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const inputEl = useRef();
  const { i18n } = useTranslation();

  const profanityCleanChannelName = leoProfanity.clean(oldName);
  const currentLang = i18n.language;
  const { username } = currentUser;
  const closeModal = () => setCurrentModal(null);
  const channelSchema = getModalSchema(channelsNames);

  useEffect(() => {
    inputEl.current.focus();
    inputEl.current.select();
  }, []);

  const formFieldClass = cn('form-control', {
    'mb-3': !invalidForm,
    'mb-2': invalidForm,
    'is-invalid': invalidForm,
  });

  const makeInvldForm = (error) => {
    setInvalidForm(true);
    const errorText = error === 'exists' ? t('modals.channelExists') : t('validUsernameOrChannelErr');

    return (<p className="text-danger mb-1">{errorText}</p>);
  };

  const resetInvldForm = () => {
    setInvalidForm(false);

    return null;
  };

  const getButtonStyle = () => (currentLang === 'ru' ? { minWidth: '6.464rem' } : { minWidth: '4.525rem' });

  return (
    <div>
      <div className="fade modal-backdrop show" />
      <div role="dialog" aria-modal="true" className="fade modal show" tabIndex="-1" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">{t('modals.renameChannel')}</div>
              <button
                type="button"
                aria-label="Close"
                data-bs-dismiss="modal"
                className="btn btn-close"
                onClick={closeModal}
              />
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{ name: profanityCleanChannelName }}
                validationSchema={channelSchema}
                validateOnChange={false}
                validateOnBlur={false}
                validateOnSubmit
                onSubmit={(value) => {
                  value.id = id;
                  setButtonsDisabled(true);
                  socket.emit('renameChannel', value, ({ status }) => {
                    if (status === 'ok') {
                      toast.success(t('modals.channelRenamed'));
                      // service announcement of the renaming:
                      socket.emit('newMessage', {
                        channelId: id,
                        isService: {
                          root: 'noticeRenameChannel',
                          data: { username, oldName, newName: value.name },
                        },
                        date: new Date(),
                      });
                      closeModal();
                    } else {
                      toast.error(t('networkError'));
                      rollbar.error('RemoveMessageModal error');
                    }
                  });
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <Field name="name">
                      {({ field }) => (
                        <div>
                          <input name="name" id="name" className={formFieldClass} {...field} ref={inputEl} />
                          <label htmlFor="name" className="visually-hidden">{t('modals.channelName')}</label>
                        </div>
                      )}
                    </Field>
                    {errors.name && touched.name ? makeInvldForm(errors.name) : resetInvldForm()}
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-dark me-2"
                        style={getButtonStyle()}
                        onClick={closeModal}
                        disabled={buttonsDisabled}
                      >
                        {t('modals.cancel')}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-outline-primary"
                        style={getButtonStyle()}
                        disabled={buttonsDisabled || btnDisabledNetworkWait}
                      >
                        {t('send')}
                      </button>
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
};

export default RenameChannelModal;
