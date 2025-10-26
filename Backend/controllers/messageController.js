const { Message, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, recipientId: userId },
          { senderId: userId, recipientId: currentUserId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      senderId,
      recipientId,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
