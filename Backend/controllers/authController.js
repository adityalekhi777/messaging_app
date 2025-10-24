const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = 'your_jwt_secret'; // Replace with a strong secret in a .env file

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'User with this email or username already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};