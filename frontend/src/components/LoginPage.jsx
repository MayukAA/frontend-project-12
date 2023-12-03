/* eslint-disable */

import '../styles.scss';
import 'bootstrap';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Минимум 2 буквы')
    .max(25, 'Максимум 25 букв')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Минимум 6 символов')
    .required('Обязательное поле'),
});

const LoginPage = () => (
  <div className="h-100 bg-light" id="chat">
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
        </div>
      </nav>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row justify-content-center p-5">
                <Formik
                  initialValues={{ username: '', password: '' }}
                  validationSchema={SignupSchema}
                  validateOnChange={false}
                  validateOnBlur={false}
                  validateOnSubmit={true}
                  onSubmit={(values, { setSubmitting }) => {
                    console.log(values);
                    setSubmitting(false);
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="col-12 col-md-6 mt-3 mt-mb-0">
                      <h1 className="text-center mb-4">Войти</h1>
                      <div className="form-floating mb-3">
                        <Field type="text" name="username" placeholder="Ваш ник" id="username" className="form-control" />
                        <label htmlFor="username">Ваш ник</label>
                        {errors.username && touched.username ? (
                          <p className="text-danger p-1">{errors.username}</p>
                        ) : null}
                      </div>
                      <div className="form-floating mb-3">
                        <Field type="password" name="password" placeholder="Пароль" id="password" className="form-control" />
                        <label className="form-label" htmlFor="password">Пароль</label>
                        {errors.password && touched.password ? (
                          <p className="text-danger p-1">{errors.password}</p>
                        ) : null}
                      </div>
                      <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoginPage;
