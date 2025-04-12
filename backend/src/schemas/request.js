const { DataTypes } = require('sequelize');
const sequelize = require('./postgres');

const Request = sequelize.define('Request', {
  requestId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('course', 'exam', 'appointment'),
    allowNull: false,
  },
  examType: {
    type: DataTypes.ENUM('practical', 'theoretical'),
    allowNull: true,
  },
  requestDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
    defaultValue: 'pending',
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  trafficUnit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Request',
  timestamps: true,
});

module.exports = Request;