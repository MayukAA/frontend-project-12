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

import { AuthorizationContext, UtilsContext } from '../context/index';
import { signupSchema } from '../utils/validationSchemas';
import routes from '../utils/routes';

const SignUpPage = () => {
  const { authorization } = useContext(AuthorizationContext);
  const { t, rollbar } = useContext(UtilsContext);
  const [signUpError, setSignUpError] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const labelEl = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    labelEl.current.focus();
  }, []);

  const getWarningValidation = (validError) => (
    <div
      className="position-absolute card border-0 bg-warning text-nowrap smallFont px-2"
      style={{ top: '35%', left: '102.5%' }}
    >
      {t(validError)}
    </div>
  );

  const usernameFieldClass = cn('form-control', { 'is-invalid': signUpError });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <Formik
                initialValues={{ username: '', password: '', passwordConf: '' }}
                validationSchema={signupSchema}
                validateOnBlur
                validateOnChange
                validateOnSubmit
                onSubmit={async (values) => {
                  const { username, password } = values;
                  setSignUpError(false);
                  setBtnDisabled(true);
                  try {
                    const response = await axios.post(routes.signupPath(), { username, password });
                    authorization(response.data);
                    navigate('/');
                  } catch (error) {
                    setBtnDisabled(false);
                    rollbar.error('SignUpPage', error);
                    if (error.message === 'Network Error') toast.error(t('networkError'));
                    else if (error.response.status === 409) setSignUpError(true);
                  }
                }}
              >
                {({ errors, touched }) => (
                  <Form className="w-50">
                    <h1 className="text-center mb-4">{t('registration')}</h1>
                    <div className="form-floating mb-3">
                      <Field
                        type="text"
                        name="username"
                        placeholder={t('signUpPage.userName')}
                        id="username"
                        className={usernameFieldClass}
                      />
                      <label className="form-label" htmlFor="username" ref={labelEl}>
                        {t('signUpPage.userName')}
                      </label>
                      {(errors.username && touched.username) && getWarningValidation('validUsernameOrChannelErr')}
                    </div>
                    <div className="form-floating mb-3">
                      <Field
                        type="password"
                        name="password"
                        placeholder={t('password')}
                        id="password"
                        className="form-control"
                      />
                      <label className="form-label" htmlFor="password">{t('password')}</label>
                      {(errors.password && touched.password) && getWarningValidation('signUpPage.validationPasswordErr')}
                    </div>
                    <div className="form-floating mb-4">
                      <Field
                        type="password"
                        name="passwordConf"
                        placeholder={t('signUpPage.passwordConfirm')}
                        id="passwordConf"
                        className="form-control"
                      />
                      <label className="form-label" htmlFor="passwordConf">
                        {t('signUpPage.passwordConfirm')}
                      </label>
                      {(errors.passwordConf && touched.passwordConf) && getWarningValidation('signUpPage.passwordMatch')}
                      {signUpError && (
                        <div className="position-absolute card border-0 bg-danger text-light smallFont w-100 margin-top-2px ps-2">
                          {t('signUpPage.userExists')}
                        </div>
                      )}
                    </div>
                    <button type="submit" className="w-100 btn btn-outline-primary" disabled={btnDisabled}>
                      {t('signUpPage.signUp')}
                    </button>
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
