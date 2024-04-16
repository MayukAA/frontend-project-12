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

import { AuthorizationContext, UtilsContext, StateContext } from '../../context/index';
import { getModalSchema } from '../../utils/validationSchemas';

const AddChannelModal = ({ channelsNames }) => {
  const { currentUser } = useContext(AuthorizationContext);
  const {
    socket,
    t,
    rollbar,
    setCurrentChannel,
  } = useContext(UtilsContext);
  const { setCurrentModal, btnDisabledNetworkWait } = useContext(StateContext);
  const [invalidForm, setInvalidForm] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const labelEl = useRef();
  const { i18n } = useTranslation();

  const currentLang = i18n.language;
  const { username } = currentUser;
  const closeModal = () => setCurrentModal(null);
  const channelSchema = getModalSchema(channelsNames);

  useEffect(() => {
    labelEl.current.focus();
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
              <div className="modal-title h4">{t('modals.addChannel')}</div>
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
                initialValues={{ name: '' }}
                validationSchema={channelSchema}
                validateOnChange={false}
                validateOnBlur={false}
                validateOnSubmit
                onSubmit={(value) => {
                  setButtonsDisabled(true);
                  socket.emit('newChannel', value, ({ status, data }) => {
                    if (status === 'ok') {
                      toast.success(t('modals.channelCreated'));
                      // перенос создателя канала в новый канал:
                      setCurrentChannel({ id: data.id, name: data.name, status: 'standart' });
                      // служебное сообщение - дата (число-месяц):
                      const date = new Date();
                      socket.emit('newMessage', { channelId: data.id, isService: { root: 'newDay' }, date });
                      // служебное сообщение о создании канала:
                      socket.emit('newMessage', {
                        channelId: data.id,
                        isService: {
                          root: 'noticeAddChannel',
                          data: { username },
                        },
                        date: new Date(),
                      });
                      closeModal();
                    } else {
                      toast.error(t('networkError'));
                      rollbar.error('AddChannelModal error');
                    }
                  });
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div>
                      <Field name="name" id="name" className={formFieldClass} />
                      <label htmlFor="name" className="visually-hidden" ref={labelEl}>{t('modals.channelName')}</label>
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

export default AddChannelModal;
