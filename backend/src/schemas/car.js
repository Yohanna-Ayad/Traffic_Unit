// models/Selection.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("./postgres");

const Car = sequelize.define(
  "Car",
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
    engineTorqueRPM : {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bodyType: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
  },
  {
    sequelize,
    modelName: "Car",
    tableName: "Car",
    timestamps: true,
    version: true,
  }
);



// Selection.associate = (models) => {
//     Selection.belongsToMany(models.Field, { through: 'SelectionField' });
// }

module.exports = Car;

// class Selection extends Model {
//     static associate(models) {
//         Selection.belongsToMany(models.Field, { through: 'SelectionField' });
//     }
// }

// Selection.init(
//   {
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Selection',
//     tableName: 'Selection',
//     timestamps: false,
//   }
// );

//     // Insert data into Selection table

//     const selectionData = [
//         { name: 'importer1' },
//         { name: 'concession' },
//         { name: 'supplier' },
//         { name: 'sold_from' },
//         { name: 'origin' },
//         { name: 'terms' },
//         { name: 'shipping_official' },
//         { name: 'status' },
//         { name: 'f_destination' },
//         { name: 'clearance_co' },
//         { name: 'currency' }
//     ];

// Selection.sync({ force: false }).then(() => {
//     console.log('Selection table created');
//     });

//     Selection.afterSync(() => {
//         selectionData.forEach((selection) => {
//             Selection.findOrCreate({
//                 where: { name: selection.name },
//                 defaults: selection,
//             });
//         });
//     });

// module.exports = Selection;
