const sequelize = require("./postgres");
const { DataTypes, Model } = require("sequelize");
const validator = require("validator");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    nationalId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true, // Now nullable
      trim: true,
      validate: {
        len: [14, 14],
        isNumeric: true,
      },
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
      allowNull: true,
      // Changed to allowNull: true
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email!");
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Now nullable
      // Changed to allowNull: true
      trim: true,
      validate: {
        len: [7, 100],
        notContains: "password",
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true, // Now nullable
      validate: {
        isIn: [["male", "female"]],
      },
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true, // Now nullable
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true, // Now nullable
    },
    government: {
      type: DataTypes.STRING,
      allowNull: true, // Now nullable
    },
    nationalIdStartDate: {
      type: DataTypes.DATE,
      allowNull: true, // Now nullable
    },
    nationalIdEndDate: {
      type: DataTypes.DATE,
      allowNull: true, // Now nullable
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true, // Now nullable
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
    validate: {
      checkRoleBasedFields() {
        if (this.role === "user") {
          // Validate required fields for users
          if (!this.nationalId) {
            throw new Error("nationalId is required for users.");
          }
          const userRequiredFields = [
            "gender",
            "nationality",
            "address",
            "government",
            // "nationalIdStartDate",
            // "nationalIdEndDate",
            "birthDate",
          ];
          for (const field of userRequiredFields) {
            if (!this[field]) {
              throw new Error(`${field} is required for users.`);
            }
          }
        } else if (this.role === "admin") {
          // Ensure admins don't have user-specific fields
          const adminDisallowedFields = [
            "nationalId",
            "gender",
            "nationality",
            "address",
            "government",
            "nationalIdStartDate",
            "nationalIdEndDate",
            "birthDate",
            "phone",
          ];
          for (const field of adminDisallowedFields) {
            if (this[field] !== null && this[field] !== undefined) {
              throw new Error(`Admins cannot have the field: ${field}.`);
            }
          }
        }
      },
    },
  }
);

module.exports = User;
