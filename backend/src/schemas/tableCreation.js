const User = require("./user");
const Vehicle = require("./car");
const VehicleLicense = require("./carLicense");
const DrivingLicense = require("./drivingLicense");
const TrafficViolation = require("./trafficViolations");
const Notification = require("./notification");
const bcrypt = require("bcrypt");
require("dotenv").config();

const sequelize = require("./postgres");
// Define associations
User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Vehicle, { foreignKey: "userId", onDelete: "CASCADE" });
Vehicle.belongsTo(User, { foreignKey: "userId" });

User.hasOne(DrivingLicense, { foreignKey: "userId", onDelete: "CASCADE" });
DrivingLicense.belongsTo(User, { foreignKey: "userId" });

User.hasMany(VehicleLicense, { foreignKey: "userId", onDelete: "CASCADE" });
VehicleLicense.belongsTo(User, { foreignKey: "userId" });

Vehicle.hasMany(VehicleLicense, { foreignKey: "carId", onDelete: "CASCADE" });
VehicleLicense.belongsTo(Vehicle, { foreignKey: "carId" });

DrivingLicense.hasMany(TrafficViolation, {
  foreignKey: "drivingLicenseId",
  onDelete: "CASCADE",
});
TrafficViolation.belongsTo(DrivingLicense, { foreignKey: "drivingLicenseId" });

VehicleLicense.hasMany(TrafficViolation, {
  foreignKey: "carLicenseId",
  onDelete: "CASCADE",
});
TrafficViolation.belongsTo(VehicleLicense, { foreignKey: "carLicenseId" });

// Sync the models with the database
sequelize
  .sync({ force: false }) // Set force: true only for development; it drops existing tables
  .then(async () => {
    console.log("Tables created and associations established");

    const adminUser = {
      name: "Johan",
      email: "eng.yohannaayad@gmail.com",
      role: "admin",
      verified: true,
      password: bcrypt.hashSync("admin", 10),
      nationalId: "30112040104515",
      phone: "01224979043",
      gender: "male",
      nationality: "Egyptian",
      address: "-",
      government: "Cairo",
      nationalIdStartDate: "2021-01-01",
      nationalIdEndDate: "2026-01-01",
      birthDate: "1998-01-01",
    };

    User.findOne({ where: { email: adminUser.email } })
      .then((user) => {
        if (!user) {
          // User not found, create it or handle the situation as needed
          console.log("User not found. Creating a new user...");
          // Example of creating a new user
          User.create(adminUser) // Create a new user
            .then((user) => {
              console.log("Admin user created:", user.get({ plain: true }));
            })
            .catch((error) => {
              console.error("Error creating user:", error);
            });
        } else {
          console.log("Admin user already exists");
        }
      })
      .catch((error) => {
        console.error("Error finding or creating user:", error);
      });

    console.log("inserting car data into the tables");

    // Insert data into Vehicle table
    if ((await Vehicle.count()) > 0) {
      console.log("Vehicle table already has data");
      return;
    } else {
      const csv = require("csvtojson");
      const jsonArray = await csv().fromFile(process.env.CSV_FILE_PATH);

      // Deduplication and validation logic
      const deduplicatedData = jsonArray.filter((item, index, self) => {
        // Exclude rows with null or empty values
        const hasNullOrEmpty = Object.values(item).some(
          (value) => value === null || value === ""
        );
        if (hasNullOrEmpty) return false;

        // Deduplicate based on unique attributes
        return (
          index ===
          self.findIndex(
            (t) =>
              t.make === item.make &&
              t.model === item.model &&
              t.year === item.year &&
              t.fuel === item.fuel &&
              t.engineType === item.engineType &&
              t.engineSize === item.engineSize &&
              // t.weight === item.weight &&
              t.type === item.type
          )
        );
      });
      await Vehicle.bulkCreate(deduplicatedData);
      console.log("CSV data has been imported into Sequelize.");
    }
  });
