const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // 'Users' is the table name
        key: 'id',
      },
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    isMedia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender',
    });
    Message.belongsTo(models.User, {
      foreignKey: 'recipientId',
      as: 'recipient',
    });
  };

  return Message;
};