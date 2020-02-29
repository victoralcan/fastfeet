import * as Yup from 'yup';

export const cadastroSchema = Yup.object().shape({
  recipient_id: Yup.number().required(),
  deliveryman_id: Yup.number().required(),
  signature_id: Yup.number().required(),
  product: Yup.string().required(),
});

export const updateSchema = Yup.object().shape({
  recipient_id: Yup.number(),
  deliveryman_id: Yup.number(),
  signature_id: Yup.number(),
  product: Yup.string(),
  start_date: Yup.date(),
  end_date: Yup.date(),
});
