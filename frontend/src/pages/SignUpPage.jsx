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

import AuthorizationContext from '../context/AuthorizationContext';
import UtilsContext from '../context/UtilsContext';
import { signupSchema } from '../utils/validationSchemas';
import routes from '../utils/routes';

const SignUpPage = () => {
  const { authorization } = useContext(AuthorizationContext);
  const { t, rollbar } = useContext(UtilsContext);
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
                  const { username, password } = values;
                  setSignUpError(false);
                  setButtonDisabled(true);
                  try {
                    const response = await axios.post(routes.signupPath(), { username, password });
                    authorization(response.data);
                    navigate('/');
                  } catch (error) {
                    setButtonDisabled(false);
                    if (error.message === 'Network Error') toast.error(t('networkError'));
                    else if (error.response.status === 409) setSignUpError(true);
                    rollbar.error('SignUpPage', error);
                  }
                }}
              >
                {({ errors, touched }) => (
                  <Form className="w-50">
                    <h1 className="text-center mb-4">{t('registration')}</h1>
                    <div className="form-floating mb-3">
                      <Field type="text" name="username" placeholder={t('signUpPage.userName')} id="username" className="form-control" />
                      <label className="form-label" htmlFor="username" ref={labelEl}>{t('signUpPage.userName')}</label>
                      {(errors.username && touched.username) && (
                        <p className="text-danger px-1">{t('validUsernameOrChannelErr')}</p>
                      )}
                    </div>
                    <div className="form-floating mb-3">
                      <Field type="password" name="password" placeholder={t('password')} id="password" className="form-control" />
                      <label className="form-label" htmlFor="password">{t('password')}</label>
                      {(errors.password && touched.password) && (
                        <p className="text-danger px-1">{t('signUpPage.validationPasswordErr6')}</p>
                      )}
                    </div>
                    <div className="form-floating mb-4">
                      <Field type="password" name="passwordConf" placeholder={t('signUpPage.passwordConfirm')} id="passwordConf" className="form-control" />
                      <label className="form-label" htmlFor="passwordConf">{t('signUpPage.passwordConfirm')}</label>
                      {(errors.passwordConf && touched.passwordConf) && (
                        <p className="text-danger px-1">{t('signUpPage.passwordMatch')}</p>
                      )}
                      {signUpError && (
                        <div className="card bg-danger text-light mt-1 p-1">{t('signUpPage.userExists')}</div>
                      )}
                    </div>
                    <button type="submit" className="w-100 btn btn-outline-primary" disabled={buttonDisabled}>{t('signUpPage.signUp')}</button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>
                  {t('signUpPage.haveAccount')}
                  {' '}
                </span>
                <a href="/login">{t('signIn')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
