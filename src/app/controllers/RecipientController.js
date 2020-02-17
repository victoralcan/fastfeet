import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
  async store(req, res) {
    if (!req.userId) {
      return res.status(401).json({ error: 'You are not logged in' });
    }

    const admin = User.findOne({
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
