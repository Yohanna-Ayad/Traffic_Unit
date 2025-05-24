// models/Selection.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("./postgres");

const Vehicle = sequelize.define(
  "Vehicle",
  {
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maker: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    engineType: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    engineCylinders: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    engineSize: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // engineTorqueRPM : {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    bodyType: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    vehicleType: {
      type: DataTypes.ENUM("car", "motorcycle"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Vehicle",
    tableName: "Vehicle",
    timestamps: true,
  }
);

module.exports = Vehicle;