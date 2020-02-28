import * as Yup from 'yup';

export const cadastroSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
});

export const updateSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email(),
});
