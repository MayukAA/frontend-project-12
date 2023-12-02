/* eslint-disable */

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
  <Formik
    initialValues={{ username: '', password: '' }}
    validationSchema={SignupSchema}
    onSubmit={(values) => {
      console.log(values);
    }}
  >
    {({ errors, touched }) => (
      <Form>
        <div>
          <label htmlFor="username">Username</label>
          <Field type="text" name="username" />
          {errors.username && touched.username ? (
            <div>{errors.username}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Field type="password" name="password" />
          {errors.password && touched.password ? (
            <div>{errors.password}</div>
          ) : null}
        </div>
        <input type="submit" value="Войти" />
      </Form>
    )}
  </Formik>
);

export default LoginPage;
