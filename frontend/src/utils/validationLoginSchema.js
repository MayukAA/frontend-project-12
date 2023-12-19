import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Минимум 2 буквы')
    .max(25, 'Максимум 25 букв')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(5, 'Минимум 5 символов')
    .required('Обязательное поле'),
});

export default loginSchema;
