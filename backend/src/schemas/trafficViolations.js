const sequelize = require("./postgres");
const { DataTypes, Model } = require("sequelize");

const TrafficViolation = sequelize.define("TrafficViolation", {
  violationNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    // Remove autoIncrement: true (incompatible with STRING type)
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  type: {
    type: DataTypes.ENUM(
      "Speeding",
      "Parking",
      "Signal",
      "Illegal U-Turn",
      "Other"
    ),
    allowNull: false,
  },
  date: { type: DataTypes.DATE, allowNull: false },
  fineAmount: { type: DataTypes.FLOAT, allowNull: false },
  status: {
    type: DataTypes.ENUM("unpaid", "paid", "pending_approval", "dismissed"),
    defaultValue: "unpaid",
  },
  paymentImage: { type: DataTypes.STRING, allowNull: true },
  grievanceStatus: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    // defaultValue: "Pending",
  },
  grievanceDescription: { type: DataTypes.STRING },
  grievanceDate: { type: DataTypes.DATE },
});

module.exports = TrafficViolation;
