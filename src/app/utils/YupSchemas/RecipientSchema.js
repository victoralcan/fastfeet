import * as Yup from 'yup';

export const cadastroSchema = Yup.object().shape({
  name: Yup.string().required(),
  rua: Yup.string().required(),
  numero: Yup.string().required(),
  complemento: Yup.string().required(),
  estado: Yup.string().required(),
  cidade: Yup.string().required(),
  cep: Yup.string().required(),
});

export const updateSchema = Yup.object().shape({
  name: Yup.string(),
  rua: Yup.string(),
  numero: Yup.string(),
  complemento: Yup.string(),
  estado: Yup.string(),
  cidade: Yup.string(),
  cep: Yup.string(),
});
