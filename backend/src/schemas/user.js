// user.js
const sequelize = require("./postgres");
const { DataTypes, Model } = require("sequelize");
const validator = require("validator");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    nationalId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      trim: true,
      validate: {
        len: [14, 14],
        isNumeric: true,
      },
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin"]],
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
      validate: {
        len: [11, 11],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid E-mail!");
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        len: [7, 100],
        notContains: "password",
      },
    },
    // verified: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    // },
    gender: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["male", "female"]],
      },
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    government: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationalIdStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nationalIdEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tokens: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    avatar: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "User",
    timestamps: true,
  }
);

module.exports = User;
