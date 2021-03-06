import Recipient from '../models/Recipient';
import User from '../models/User';
import { cadastroSchema } from '../schemas/RecipientSchema';

class RecipientController {
  async store(req, res) {
    if (!(await cadastroSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (!req.userId) {
      return res.status(401).json({ error: 'You are not logged in' });
    }

    const admin = await User.findOne({
      where: {
        email: 'admin@fastfeet.com',
      },
    });

    if (admin.id !== req.userId) {
      return res.status(403).json({ error: 'You are not admin' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
