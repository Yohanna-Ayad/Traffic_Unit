// models/Notification.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("./postgres");

const Notification = sequelize.define(
  "Notification",
  {
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
