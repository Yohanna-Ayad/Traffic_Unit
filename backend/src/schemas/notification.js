// models/Notification.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("./postgres");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "unread",
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "Notification",
    timestamps: true,
  }
);

module.exports = Notification;
