const sequelize = require("./postgres");
const { DataTypes, Model } = require("sequelize");

const DrivingLicense = sequelize.define(
    "DrivingLicense",
    {
      userName: { type: DataTypes.STRING, allowNull: false },
      nationalId: { type: DataTypes.STRING, allowNull: false },
      licenseNumber: { type: DataTypes.STRING, unique: true, allowNull: false, primaryKey: true },
      licenseType: { type: DataTypes.STRING, allowNull: false },
      startDate: { type: DataTypes.DATE, allowNull: false },
      endDate: { type: DataTypes.DATE, allowNull: false },
      trafficUnit: { type: DataTypes.STRING, allowNull: false },
      // Add more fields here
    }
    );

module.exports = DrivingLicense;