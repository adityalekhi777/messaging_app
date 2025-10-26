const { Message, Sequelize } = require('../models');
const { Op } = Sequelize;
const { s3 } = require('../config/aws');

const { PutObjectCommand } = require('@aws-sdk/client-s3');

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
    console.error(error);
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

exports.uploadFile = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const key = `${Date.now().toString()}-${file.originalname}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    await s3.send(new PutObjectCommand(params));

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const message = await Message.create({
      senderId,
      recipientId,
      content: fileUrl, // The URL of the uploaded file
      isMedia: true, // A new field to distinguish media messages
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('S3 upload error:', error);
    res.status(500).json({ error: error.message });
  }
};
