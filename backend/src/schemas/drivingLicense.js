const sequelize = require("./postgres");
const { DataTypes, Model } = require("sequelize");

const DrivingLicense = sequelize.define(
    "DrivingLicense",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,},
      userName: { type: DataTypes.STRING, allowNull: false },
      nationalId: { type: DataTypes.STRING, allowNull: false },
      licenseNumber: { type: DataTypes.STRING, unique: true, allowNull: false},
      licenseType: { type: DataTypes.STRING, allowNull: false },
      startDate: { type: DataTypes.DATE, allowNull: false },
      endDate: { type: DataTypes.DATE, allowNull: false },
      trafficUnit: { type: DataTypes.STRING, allowNull: false },
      // Add more fields here
    }
    );

module.exports = DrivingLicense;