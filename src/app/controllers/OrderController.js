import {
  isBefore,
  isAfter,
  setHours,
  parseISO,
  isPast,
  isToday,
} from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Order from '../models/Order';
import { cadastroSchema, updateSchema } from '../utils/YupSchemas/OrderSchema';
import NewOrderMail from '../jobs/NewOrderMail';
import Queue from '../../lib/Queue';

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
    const orderEmail = await Order.findByPk(order.id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });
    await Queue.add(NewOrderMail.key, {
      orderEmail,
    });
    return res.json(orderEmail);
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
      .update({ canceled_at: new Date() })
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

    const { start_date, end_date } = req.body;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'There is no Order with this id' });
    }

    if (start_date) {
      const parsedDate = parseISO(start_date);
      const maxHour = setHours(new Date(), 18);
      const minHour = setHours(new Date(), 8);
      if (order.start_date) {
        return res.status(400).json({ error: 'Start_date already registered' });
      }
      if (isPast(parsedDate) || !isToday(parsedDate)) {
        return res.status(400).json({ error: 'Invalid date' });
      }
      if (!(isBefore(parsedDate, maxHour) && isAfter(parsedDate, minHour))) {
        return res.status(400).json({
          error: 'Orders can only be withdrawn between 8am and 18pm',
        });
      }
    }

    if (end_date) {
      if (!order.start_date) {
        return res
          .status(400)
          .json({ error: 'You cant update end_date without start_date' });
      }
    }

    await order.update(req.body);

    return res.json(order);
  }
}

export default new OrderController();
