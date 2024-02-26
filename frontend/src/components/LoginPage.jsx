/* eslint-disable */

import '../styles.scss';
import 'bootstrap';
import axios from 'axios';
import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Formik, Field, Form } from 'formik';

import AuthorizationContext from '../context/AuthorizationContext';
import { loginSchema } from '../utils/validationSchemas';
import routes from '../utils/routes';

const LoginPage = () => {
  const { authorization } = useContext(AuthorizationContext);
  const [authorizationError, setAuthError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const labelEl = useRef();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    labelEl.current.focus();
  }, []);

  const formFieldClass = cn('form-control', { 'is-invalid': authorizationError });

  return (
    <div className="h-100">
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row justify-content-center p-5">
                <Formik
                  initialValues={{ username: '', password: '' }}
                  validationSchema={loginSchema}
                  validateOnChange={false}
                  validateOnBlur={false}
                  validateOnSubmit
                  onSubmit={async (values) => {
                    setAuthError(false);
                    setButtonDisabled(true);
                    try {
                      const response = await axios.post(routes.loginPath(), values);
                      authorization(response.data);
                      navigate('/');
                    } catch (error) {
                      setButtonDisabled(false);
                      if (error.message === 'Network Error') toast.error(t('networkError'));
                      else if (error.response.status === 401) setAuthError(true);
                    }
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                      <h1 className="text-center mb-4">{t('signIn')}</h1>
                      <div className="form-floating mb-3">
                        <Field type="text" name="username" placeholder={t('loginPage.username')} id="username" className={formFieldClass} />
                        <label htmlFor="username" ref={labelEl}>{t('loginPage.username')}</label>
                        {(errors.username && touched.username) && (
                          <p className="text-danger px-1">{t('validUsernameOrChannelErr')}</p>
                        )}
                      </div>
                      <div className="form-floating mb-3">
                        <Field type="password" name="password" placeholder={t('password')} id="password" className={formFieldClass} />
                        <label className="form-label" htmlFor="password">{t('password')}</label>
                        {(errors.password && touched.password) && (
                          <p className="text-danger px-1">{t('loginPage.validationPasswordErr5')}</p>
                        )}
                        {authorizationError && (
                          <div className="card bg-danger text-light mt-1 p-1">{t('loginPage.authError')}</div>
                        )}
                      </div>
                      <button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={buttonDisabled}>{t('signIn')}</button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>{t('loginPage.noAccount')} </span>
                  <a href="/signup">{t('registration')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
