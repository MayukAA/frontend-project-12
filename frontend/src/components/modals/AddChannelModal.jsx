/* eslint-disable */

import { useState, useEffect, useRef } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import cn from 'classnames';

const AddChannelModal = ({ setCurrentModal, socket, channelsNames, setCurrentChannel }) => {
  const [invalidForm, setInvalidForm] = useState(false);
  const labelEl = useRef();

  const closeModal = () => setCurrentModal(null);

  useEffect(() => {
    labelEl.current.focus();
  }, []);

  const channelSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .required('Обязательное поле')
      .notOneOf(channelsNames, 'Такое название уже существует'),
  });

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
                validateOnSubmit={true}
                onSubmit={(value) => {
                  socket.emit('newChannel', value, ({ data }) => {
                    setCurrentChannel({ id: data.id, name: data.name}); // перенос создателя канала в новый канал;
                  });
                  closeModal();
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
                        >
                          Отменить
                        </button>
                        <button type="submit" className="btn btn-outline-primary">Отправить</button>
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
