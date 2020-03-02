import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { orderEmail } = data;

    await Mail.sendMail({
      to: `${orderEmail.deliveryman.name} <${orderEmail.deliveryman.email}>`,
      subject: 'Nova Encomenda',
      template: 'newOrder',
      context: {
        deliveryman: orderEmail.deliveryman.name,
        product: orderEmail.product,
      },
    });
  }
}

export default new NewOrderMail();
