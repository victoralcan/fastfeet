import Order from '../models/Order';
import { cadastroSchema, updateSchema } from '../utils/YupSchemas/OrderSchema';

class OrderController {
  async store(req, res) {
    if (!(await cadastroSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!req.userId) {
      return res.status(401).json({ error: 'You are not logged in' });
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

  async index(req, res) {
    if (!req.userId) {
      return res.status(401).json({ error: 'You are not logged in' });
    }

    const orders = await Order.findAll();
    const ordersFilter = orders.map(order => ({
      id: order.id,
      product: order.product,
      recipient_id: order.recipient_id,
      deliveryman_id: order.deliveryman_id,
      signature_id: order.signature_id,
      start_date: order.start_date,
      end_date: order.end_date,
      canceled_at: order.canceled_at,
    }));
    return res.json(ordersFilter);
  }

  async delete(req, res) {
    if (!req.userId) {
      return res.status(401).json({ error: 'You are not logged in' });
    }

    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'There is no order with this id' });
    }

    await order
      .destroy()
      .then(res.json('Order deleted'))
      .catch(
        res.status(500).json({
          error: 'Internal Server error. Please try again later',
        })
      );
    return res;
  }

  async update(req, res) {
    if (!req.userId) {
      return res.status(401).json({ error: 'You are not logged in' });
    }

    if (!(await updateSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'There is no Order with this id' });
    }

    await order.update(req.body);

    return res.json(order);
  }
}

export default new OrderController();
