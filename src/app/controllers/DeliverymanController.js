import Deliveryman from '../models/Deliveryman';
import {
  cadastroSchema,
  updateSchema,
} from '../utils/YupSchemas/DeliverymanSchema';

class DeliverymanController {
  async store(req, res) {
    if (!(await cadastroSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const exist = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (exist) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    const { id, name, email } = deliveryman;

    return res.json({ id, name, email });
  }

  async index(req, res) {
    const deliverymans = await Deliveryman.findAll();

    const deliverymansArray = deliverymans.map(deliveryman => ({
      name: deliveryman.name,
      email: deliveryman.email,
    }));

    return res.json(deliverymansArray);
  }

  async update(req, res) {
    if (!(await updateSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id } = req.params;

    const { name, email } = req.body;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: 'There is no Deliveryman with this id' });
    }

    const exist = await Deliveryman.findOne({
      where: {
        email,
      },
    });

    if (exist) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    await deliveryman.update({
      name: name || deliveryman.name,
      email: email || deliveryman.email,
    });

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: 'There is no deliveryman with this id' });
    }

    await deliveryman
      .destroy()
      .then(res.json('Deliveryman deleted'))
      .catch(
        res.status(500).json({
          error: 'Internal Server error. Please try again later',
        })
      );
    return res;
  }
}

export default new DeliverymanController();
