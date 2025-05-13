const { DataTypes } = require('sequelize');
const sequelize = require('./postgres');

const ExamQuestion = sequelize.define('ExamQuestion', {
  questionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  questionText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionA: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionB: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionC: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionD: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: false,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'ExamQuestion',
  timestamps: true,
});

module.exports = ExamQuestion;