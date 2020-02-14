import User from '../models/User';

class UserController {
  async store(req, res) {
    const user = await User.create(req.body);

    const { id, name, email } = user;

    return res.json({ id, name, email });
  }
}

export default new UserController();
