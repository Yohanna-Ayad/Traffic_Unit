const sequelize = require("./postgres");
const { DataTypes, Model } = require("sequelize");

const TrafficViolation = sequelize.define('TrafficViolation', {
    violationNumber: { type: DataTypes.STRING, unique: true, allowNull: false, primaryKey: true },
    description: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
  });


module.exports = TrafficViolation;