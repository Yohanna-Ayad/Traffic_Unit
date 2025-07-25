const { DataTypes } = require("sequelize");
const sequelize = require("./postgres");

const Request = sequelize.define(
  "Request",
  {
    requestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    userNationalId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idFrontImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idBackImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("course", "exam", "updateLicense", "replaceLicense"),
      allowNull: false,
    },
    licenseType: {
      type: DataTypes.STRING,
      allowNull: true,
      // type: DataTypes.ENUM,
      // values: ["vehicle", "driving"],
    },
    paymentImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licenseId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    examType: {
      type: DataTypes.ENUM("practical", "theoretical"),
      allowNull: true,
    },
    requestDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "approved",
        "rejected",
        "completed",
        "failed"
      ),
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM("unpaid", "paid", "pending_approval", "rejected"),
      defaultValue: "unpaid",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trafficUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Request",
    timestamps: true,
  }
);

module.exports = Request;
