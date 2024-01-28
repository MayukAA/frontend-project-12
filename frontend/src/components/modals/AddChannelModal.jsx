/* eslint-disable */

import {
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { Formik, Field, Form } from 'formik';
import cn from 'classnames';
import AuthorizationContext from '../../context/AuthorizationContext';
import { getModalSchema } from '../../utils/validationSchemas';

const AddChannelModal = ({ socket, channelsNames }) => {
  const { currentUser, setCurrentModal, setCurrentChannel } = useContext(AuthorizationContext);
  const [invalidForm, setInvalidForm] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const labelEl = useRef();

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

  const makeInvalidForm = (error) => {
    setInvalidForm(true);

    return (<p className="text-danger mb-1">{error}</p>);
  };

  const resetInvalidForm = () => {
    setInvalidForm(false);

    return null;
  };

  return (
    <div>
      <div className="fade modal-backdrop show" />
      <div role="dialog" aria-modal="true" className="fade modal show" tabIndex="-1" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Добавить канал</div>
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
                      // перенос создателя канала в новый канал:
                      setCurrentChannel({ id: data.id, name: data.name });
                      // для служебного сообщения:
                      const body = `Пользователь ${username} создал канал`;
                      socket.emit('newMessage', { body, channelId: data.id, author: 'serviceMsg' });
                      closeModal();
                    }
                  });
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div>
                      <Field name="name" id="name" className={formFieldClass} />
                      <label htmlFor="name" className="visually-hidden" ref={labelEl}>Имя канала</label>
                      {errors.name && touched.name ? makeInvalidForm(errors.name) : resetInvalidForm()}
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-dark me-2"
                          onClick={closeModal}
                          disabled={buttonsDisabled}
                        >
                          Отменить
                        </button>
                        <button type="submit" className="btn btn-outline-primary" disabled={buttonsDisabled}>Отправить</button>
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
