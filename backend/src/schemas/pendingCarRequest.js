const { DataTypes } = require("sequelize");
const sequelize = require("./postgres");

const PendingCarRequest = sequelize.define(
  "PendingCarRequest",
  {
    requestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING(14),
      allowNull: false,
      references: {
        model: "User",
        key: "nationalId",
      },
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Vehicle",
        key: "id",
      },
    },
    requestDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "completed"),
      defaultValue: "pending",
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "PendingCarRequest",
    timestamps: true,
  }
);

module.exports = PendingCarRequest;
