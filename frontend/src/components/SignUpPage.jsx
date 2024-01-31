/* eslint-disable */

import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import AuthorizationContext from '../context/AuthorizationContext';
import { signupSchema } from '../utils/validationSchemas';
import routes from '../utils/routes';

const SignUpPage = () => {
  const { authorization } = useContext(AuthorizationContext);
  const [signUpError, setSignUpError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const labelEl = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    labelEl.current.focus();
  }, []);

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <Formik
                initialValues={{ username: '', password: '', passwordConf: '' }}
                validationSchema={signupSchema}
                validateOnChange={false}
                validateOnBlur={false}
                validateOnSubmit
                onSubmit={async (values) => {
                  setSignUpError(false);
                  setButtonDisabled(true);
                  const { username, password } = values;
                  try {
                    const response = await axios.post(routes.signupPath(), { username, password });
                    authorization(response.data);
                    navigate('/');
                  } catch (error) {
                    // console.error(error);
                    setButtonDisabled(false);
                    (error.response.status === 409) && setSignUpError(true);
                  }
                }}
              >
                {({ errors, touched }) => (
                  <Form className="w-50">
                    <h1 className="text-center mb-4">Регистрация</h1>
                    <div className="form-floating mb-3">
                      <Field type="text" name="username" placeholder="Имя пользователя" id="username" className="form-control" />
                      <label className="form-label" htmlFor="username" ref={labelEl}>Имя пользователя</label>
                      {(errors.username && touched.username) && (
                        <p className="text-danger px-1">{errors.username}</p>
                      )}
                    </div>
                    <div className="form-floating mb-3">
                      <Field type="password" name="password" placeholder="Пароль" id="password" className="form-control" />
                      <label className="form-label" htmlFor="password">Пароль</label>
                      {(errors.password && touched.password) && (
                        <p className="text-danger px-1">{errors.password}</p>
                      )}
                    </div>
                    <div className="form-floating mb-4">
                      <Field type="password" name="passwordConf" placeholder="Подтвердите пароль" id="passwordConf" className="form-control" />
                      <label className="form-label" htmlFor="passwordConf">Подтвердите пароль</label>
                      {(errors.passwordConf && touched.passwordConf) && (
                        <p className="text-danger px-1">{errors.passwordConf}</p>
                      )}
                      {signUpError && (
                        <div className="card bg-danger text-light mt-1 p-1">Такой пользователь уже существует</div>
                      )}
                    </div>
                    <button type="submit" className="w-100 btn btn-outline-primary" disabled={buttonDisabled}>Зарегистрироваться</button>
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

export default SignUpPage;
