import Order from '../models/Order';
import { cadastroSchema } from '../utils/YupSchemas/OrderSchema';

class OrderController {
  async store(req, res) {
    if (!(await cadastroSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
    } = req.body;

    const dados = {
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
    };

    const order = await Order.create(dados);
    return res.json(order);
  }
}

export default new OrderController();
