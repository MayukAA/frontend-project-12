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
import { Formik, Field, Form } from 'formik';

import AuthorizationContext from '../context/AuthorizationContext';
import { loginSchema } from '../utils/validationSchemas';
import routes from '../utils/routes';

const LoginPage = () => {
  const { authorization } = useContext(AuthorizationContext);
  const [authorizationError, setAuthorizationError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const labelEl = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    labelEl.current.focus();
  }, []);

  const formFieldClass = cn('form-control', {
    'is-invalid': authorizationError,
  });

  return (
    <div className="h-100">
      {networkError && <div className="alert alert-danger" role="alert">Ошибка соединения!</div>}
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
                    setAuthorizationError(false);
                    setNetworkError(false);
                    setButtonDisabled(true);
                    try {
                      const response = await axios.post(routes.loginPath(), values);
                      authorization(response.data);
                      navigate('/');
                    } catch (error) {
                      // console.error(error);
                      setButtonDisabled(false);
                      if (error.response.status === 401) {
                        setAuthorizationError(true);
                      } else {
                        setNetworkError(true);
                      }
                    }
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                      <h1 className="text-center mb-4">Войти</h1>
                      <div className="form-floating mb-3">
                        <Field type="text" name="username" placeholder="Ваш ник" id="username" className={formFieldClass} />
                        <label htmlFor="username" ref={labelEl}>Ваш ник</label>
                        {(errors.username && touched.username) && (
                          <p className="text-danger px-1">{errors.username}</p>
                        )}
                      </div>
                      <div className="form-floating mb-3">
                        <Field type="password" name="password" placeholder="Пароль" id="password" className={formFieldClass} />
                        <label className="form-label" htmlFor="password">Пароль</label>
                        {(errors.password && touched.password) && (
                          <p className="text-danger px-1">{errors.password}</p>
                        )}
                        {authorizationError && (
                          <div className="card bg-danger text-light mt-1 p-1">Неверные имя пользователя или пароль</div>
                        )}
                      </div>
                      <button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={buttonDisabled}>Войти</button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>Нет аккаунта? </span>
                  <a href="/signup">Регистрация</a>
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
