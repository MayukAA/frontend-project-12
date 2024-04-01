import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import cn from 'classnames';

import AuthorizationContext from '../context/AuthorizationContext';
import UtilsContext from '../context/UtilsContext';
import routes from '../utils/routes';

const LoginPage = () => {
  const { authorization } = useContext(AuthorizationContext);
  const { t, rollbar } = useContext(UtilsContext);
  const [authorizationError, setAuthError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const labelEl = useRef();
  const navigate = useNavigate();

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
                      rollbar.error('LoginPage', error);
                    }
                  }}
                >
                  <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                    <h1 className="text-center mb-4">{t('signIn')}</h1>
                    <div className="form-floating mb-3">
                      <Field
                        type="text"
                        name="username"
                        placeholder={t('loginPage.username')}
                        id="username"
                        className={formFieldClass}
                        required
                      />
                      <label htmlFor="username" ref={labelEl}>{t('loginPage.username')}</label>
                    </div>
                    <div className="form-floating mb-4">
                      <Field
                        type="password"
                        name="password"
                        placeholder={t('password')}
                        id="password"
                        className={formFieldClass}
                        required
                      />
                      <label className="form-label" htmlFor="password">{t('password')}</label>
                      {authorizationError && (
                        <div className="invalid-tooltip w-100 ps-2 py-0">
                          {t('loginPage.authError')}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-100 mb-3 btn btn-outline-primary"
                      disabled={buttonDisabled}
                    >
                      {t('signIn')}
                    </button>
                  </Form>
                </Formik>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>
                    {t('loginPage.noAccount')}
                    {' '}
                  </span>
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
