const User = require("./user");
const Vehicle = require("./car");
const VehicleLicense = require("./carLicense");
const DrivingLicense = require("./drivingLicense");
const TrafficViolation = require("./trafficViolations");
const Notification = require("./notification");
const Request = require("./request");
const PendingCarRequest = require("./pendingCarRequest");
const ExamQuestion = require("./examQuestions");
const bcrypt = require("bcrypt");
require("dotenv").config();

const sequelize = require("./postgres");
// Define associations
User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Vehicle, { foreignKey: "userId", onDelete: "CASCADE" });
Vehicle.belongsTo(User, { foreignKey: "userId" });

// User.hasOne(DrivingLicense, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(DrivingLicense, { foreignKey: "userId" });
DrivingLicense.belongsTo(User, { foreignKey: "userId" });

// User.hasMany(VehicleLicense, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasOne(VehicleLicense, { foreignKey: "userId" });
VehicleLicense.belongsTo(User, { foreignKey: "userId" });

// Add to your existing associations setup
User.hasMany(Request, { foreignKey: "userId", onDelete: "CASCADE" });
Request.belongsTo(User, { foreignKey: "userId" });

Vehicle.hasMany(VehicleLicense, {
  foreignKey: "vehicleId",
  onDelete: "CASCADE",
});
VehicleLicense.belongsTo(Vehicle, { foreignKey: "vehicleId" });

DrivingLicense.hasMany(TrafficViolation, {
  foreignKey: "drivingLicenseId",
  onDelete: "CASCADE",
});
TrafficViolation.belongsTo(DrivingLicense, { foreignKey: "drivingLicenseId" });

VehicleLicense.hasMany(TrafficViolation, {
  foreignKey: "vehicleLicenseId",
  onDelete: "CASCADE",
});
TrafficViolation.belongsTo(VehicleLicense, { foreignKey: "vehicleLicenseId" });

User.hasMany(PendingCarRequest, { foreignKey: "userId", onDelete: "CASCADE" });
PendingCarRequest.belongsTo(User, { foreignKey: "userId" });
PendingCarRequest.belongsTo(Vehicle, { foreignKey: "vehicleId" });
Vehicle.hasMany(PendingCarRequest, { foreignKey: "vehicleId" });

// Sync the models with the database
sequelize
  .sync({ force: false }) // Set force: true only for development; it drops existing tables
  .then(async () => {
    console.log("Tables created and associations established");

    const adminUser = {
      name: "JOE Doe",
      email: "joedoe@gmail.com",
      role: "admin",
      // verified: true,
      password: bcrypt.hashSync("admin123", 10),
      // nationalId: "30112040104515",
      // phone: "01224979043",
      // gender: "male",
      // nationality: "Egyptian",
      // address: "-",
      // government: "Cairo",
      // nationalIdStartDate: "2021-01-01",
      // nationalIdEndDate: "2026-01-01",
      // birthDate: "1998-01-01",
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

    // Check if ExamQuestion table is empty
    if ((await ExamQuestion.count()) > 0) {
      console.log("ExamQuestion table already has data");
      return;
    } else {
      console.log("ExamQuestion table is empty, inserting data from CSV file");
      const csv = require("csvtojson");
      const examQuestions = await csv()
        .fromFile(process.env.EXAM_QUESTIONS_FILE_PATH)
        .then((data) =>
          data.map((item) => ({
            questionText: item["Question"],
            optionA: item["Option A"],
            optionB: item["Option B"],
            optionC: item["Option C"],
            optionD: item["Option D"],
            correctAnswer: item["Answer"],
            explanation: item["Explanation"] || "", // Optional field
          }))
        );

      console.log("Exam questions length:", examQuestions.length);

      // Insert into database
      await ExamQuestion.bulkCreate(examQuestions, {
        validate: true,
        fields: [
          "questionText",
          "optionA",
          "optionB",
          "optionC",
          "optionD",
          "correctAnswer",
          "explanation",
        ],
      });

      // console.log(`Imported ${deduplicatedQuestions.length} exam questions`);
      // console.log(
      //   await ExamQuestion.findAll({
      //     limit: 10,
      //   })
      // );
    }

    // Insert data into Vehicle table
    if ((await Vehicle.count()) > 0) {
      console.log("Vehicle table already has data");
      return;
    } else {
      console.log("Vehicle table is empty, inserting data from CSV files");
      const csv = require("csvtojson");

      // Read and transform data with field mapping
      const carData = await csv()
        .fromFile(process.env.CSV_FILE_PATH)
        .then((data) =>
          data.map((item) => ({
            maker: item.make, // Map CSV 'make' to DB 'maker'
            model: item.model,
            year: item.year,
            engineType: item.engineType,
            engineCylinders: item.engineCylinders,
            engineSize: parseFloat(item.engineSize) || 0,
            bodyType: item.bodyType,
            vehicleType: "car",
          }))
        );

      const motorcycleData = await csv()
        .fromFile(process.env.CSV_FILE_PATH2)
        .then((data) =>
          data.map((item) => ({
            maker: item.make, // Map CSV 'make' to DB 'maker'
            model: item.model,
            year: item.year,
            engineType: item.engineType,
            engineCylinders: item.engineCylinders,
            engineSize: parseFloat(item.engineSize) || 0,
            bodyType: item.bodyType,
            vehicleType: "motorcycle",
          }))
        );

      // Combine datasets
      const combinedData = [...carData, ...motorcycleData];
      console.log("Combined data length:", combinedData.length);

      // Deduplication logic for Vehicle model
      const deduplicatedData = combinedData.filter((item, index, self) => {
        // Validate required fields based on model
        const requiredFields = [
          "maker",
          "model",
          "year",
          "engineCylinders",
          "engineType",
        ];
        const isValid = requiredFields.every(
          (field) => item[field] && item[field].toString().trim() !== ""
        );

        if (!isValid) {
          // console.log("Invalid row:", item);
          return false;
        }

        // Check for duplicate using model's unique constraints
        return (
          index ===
          self.findIndex(
            (t) =>
              t.maker === item.maker &&
              t.model === item.model &&
              t.year === item.year &&
              t.vehicleType === item.vehicleType &&
              t.engineType === item.engineType &&
              t.engineCylinders === item.engineCylinders
          )
        );
      });

      console.log("Deduplicated data length:", deduplicatedData.length);

      // Insert into Vehicle table with field mapping
      await Vehicle.bulkCreate(deduplicatedData, {
        validate: true,
        fields: [
          "maker",
          "model",
          "year",
          "engineType",
          "engineCylinders",
          "engineSize",
          "bodyType",
          "vehicleType",
        ],
      });

      console.log(`Imported ${deduplicatedData.length} vehicles:
- Cars: ${carData.length} initial records
- Motorcycles: ${motorcycleData.length} initial records
- Duplicates removed: ${combinedData.length - deduplicatedData.length}`);

      // console.log(
      //   await Vehicle.findAll({
      //     limit: 10,
      //     where: { vehicleType: "motorcycle" },
      //   })
      // );
      // const csv = require("csvtojson");
      // const jsonArray = await csv().fromFile(process.env.CSV_FILE_PATH);

      // // Deduplication and validation logic
      // const deduplicatedData = jsonArray.filter((item, index, self) => {
      //   // Exclude rows with null or empty values
      //   const hasNullOrEmpty = Object.values(item).some(
      //     (value) => value === null || value === ""
      //   );
      //   if (hasNullOrEmpty) return false;

      //   // Deduplicate based on unique attributes
      //   return (
      //     index ===
      //     self.findIndex(
      //       (t) =>
      //         t.make === item.make &&
      //         t.model === item.model &&
      //         t.year === item.year &&
      //         t.fuel === item.fuel &&
      //         t.engineType === item.engineType &&
      //         t.engineSize === item.engineSize &&
      //         // t.weight === item.weight &&
      //         t.type === item.type
      //     )
      //   );
      // });
      // await Vehicle.bulkCreate(deduplicatedData);
      // console.log("CSV data has been imported into Sequelize.");
    }
  });
