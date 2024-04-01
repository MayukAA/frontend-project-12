import * as Yup from 'yup';

export const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Минимум 3 буквы')
    .max(20, 'Максимум 20 букв')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Минимум 6 символов')
    .required('Обязательное поле'),
  passwordConf: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});

export const getModalSchema = (channelsNames) => Yup.object().shape({
  name: Yup.string()
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов')
    .required('Обязательное поле')
    .notOneOf(channelsNames, 'exists'),
});
