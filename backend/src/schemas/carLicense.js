const sequelize = require("./postgres");
const { DataTypes, Model } = require("sequelize");

const VehicleLicense = sequelize.define("VehicleLicense", {
  plateNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  status: { type: DataTypes.STRING, defaultValue: "Active", allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: true },
  nationalId: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  // numberOfCylinders: { type: DataTypes.INTEGER, allowNull: false },
  motorNumber: { type: DataTypes.STRING, allowNull: false },
  chassisNumber: { type: DataTypes.STRING, allowNull: false },
  // motorCapacityLitres: { type: DataTypes.FLOAT, allowNull: false },
  // petrolType: { type: DataTypes.STRING, allowNull: false },
  carColor: { type: DataTypes.STRING, allowNull: false },
  checkDate: { type: DataTypes.DATE, allowNull: false },
  trafficUnit: { type: DataTypes.STRING, allowNull: true },
  licenseType: { type: DataTypes.STRING, allowNull: false },
});

module.exports = VehicleLicense;
