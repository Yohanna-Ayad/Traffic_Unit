const Sirv = require("../functions/Sirv");
const User = require("../schemas/user");
const { Op, where } = require("sequelize"); // Required for comparison operators
const { v4: uuidv4 } = require("uuid");
const DrivingLicense = require("../schemas/drivingLicense");
const VehicleLicense = require("../schemas/carLicense");
const PendingCarRequest = require("../schemas/pendingCarRequest");

const Car = require("../schemas/car");
const CarLicense = require("../schemas/carLicense");
const Request = require("../schemas/request");
const Notification = require("../schemas/notification");
const TrafficViolation = require("../schemas/trafficViolations");
const { format } = require("date-fns");

const utilities = require("../functions/utils");
const { Where } = require("sequelize/lib/utils");
// const firebase = require("../functions/firebase");
// const CryptoJS = require("crypto-js");
// const hmacSHA256 = require("crypto-js/hmac-sha256");
// const Base64 = require('crypto-js/enc-base64');
// const mailer = require("../functions/nodemailer");

// const { Buffer } = require("buffer");
// const LiveDiagnostics = require("../schemas/liveDiagnostics");
// const { version } = require("os");
// const { where } = require("sequelize");

// const signupProcess = async ({ name, email, password, role, permission }) => {
//   if (!name || !email || !password || !role || !permission) {
//     return "All fields are required!";
//   }
//   if (await User.findOne({ where: { email } })) {
//     console.error("Email already Taken");
//     return "Account Already Exist";
//   }

//   if (password.length < 8) {
//     console.error("Password must be at least 8 characters!");
//     return "Password must be at least 8 characters!";
//   }
//   if (role !== "admin" && role !== "user" && role !== "member") {
//     console.error("Role does not exist!");
//     return "Role does not exist!";
//   }
//   if (permission.length === 0 || !permission) {
//     console.error("Permission is required!");
//     return "Permission is required!";
//   }
//   return null;
// };

const signupProcess = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role) {
    return "All fields are required!";
  }
  if (await User.findOne({ where: { email } })) {
    console.error("Email already Taken");
    return "Account Already Exist";
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters!");
    return "Password must be at least 8 characters!";
  }
  if (role !== "admin" && role !== "user") {
    console.error("Role does not exist!");
    return "Role does not exist!";
  }
  return null;
};

const adminServices = {
  createAdmin: async ({ name, email, password, role }) => {
    const validationError = await signupProcess({
      name,
      email,
      password,
      role,
    });
    if (validationError) {
      return validationError;
      // throw new Error(validationError);
    }
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    password = await utilities.hashPassword(password);
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    if (!user) {
      return "Failed to create user!";
    }
    return user;
  },
  getAllAdmins: async (user) => {
    const admins = await User.findAll({ where: { role: "admin" } });
    const filterAdmins = admins.filter((admin) => admin.id !== user.id);
    const returnData = filterAdmins.map((admin) => {
      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
    });
    return returnData;
  },
  editAdmin: async (user, payload) => {
    const admin = await User.findOne({ where: { id: user.id } });
    if (!admin) {
      throw new Error("Admin not found");
    }

    const allowedEdits = ["name", "password"];
    const updates = {};

    // Process updates synchronously with proper async handling
    for (const key of allowedEdits) {
      if (payload[key]) {
        if (key === "password") {
          if (payload[key].length < 8) {
            throw new Error("Password must be at least 8 characters!");
          }
          // Hash password synchronously before adding to updates
          updates[key] = await utilities.hashPassword(payload[key]);
        } else {
          updates[key] = payload[key];
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("No fields to edit");
    }

    const updatedAdmin = await admin.update(updates);
    return updatedAdmin;
  },
  deleteAdmin: async (id) => {
    const admin = await User.findOne({ where: { id: id } });
    if (!admin) {
      throw new Error("Admin not found");
    }
    await admin.destroy();
    return "Admin deleted successfully!";
  },
  getAllDrivingLicenses: async () => {
    const drivingLicenses = await DrivingLicense.findAll();
    return drivingLicenses;
  },
  addDrivingLicense: async (payload) => {
    if (
      !payload.nationalId ||
      !payload.licenseNumber ||
      !payload.startDate ||
      !payload.endDate ||
      !payload.licenseType ||
      !payload.government ||
      !payload.trafficUnit ||
      !payload.userName
    ) {
      return "All fields are required!";
    }
    const user = await User.findOne({
      where: { nationalId: payload.nationalId },
    });
    // if (!user) {
    //   return "User not found";
    // }
    // console.log(payload);
    if (
      await DrivingLicense.findOne({
        where: { licenseNumber: payload.licenseNumber },
      })
    ) {
      return "Driving license already exists";
    }
    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);
    if (startDate > endDate || startDate > new Date()) {
      throw new Error("Invalid dates");
    }
    if (endDate < new Date()) {
      throw new Error("Driving license is expired");
    }
    const drivingLicense = await DrivingLicense.create({
      userName: payload.userName,
      nationalId: payload.nationalId,
      // userName: user ? user.name : payload.userName,
      // nationalId: user ? user.nationalId : payload.nationalId,
      userId: user ? user.id : null,
      licenseNumber: payload.licenseNumber,
      licenseType: payload.licenseType,
      trafficUnit: payload.trafficUnit,
      startDate: startDate,
      endDate: endDate,
    });
    await drivingLicense.save();
    return drivingLicense;
  },
  getAllCarLicenses: async () => {
    const carLicenses = await CarLicense.findAll();
    const carsLinked = await Car.findAll({
      where: { id: carLicenses.map((car) => car.vehicleId) },
    });
    const usersLinked = await User.findAll({
      where: { id: carLicenses.map((car) => car.userId) },
    });
    const carLicensesWithLicenseNumber = carLicenses.map((carLicense) => {
      const car = carsLinked.find((car) => car.id === carLicense.vehicleId);
      // const user = usersLinked.find((user) => user.id === carLicense.userId);
      return {
        carLicense: { ...carLicense.dataValues },
        vehicle: car,
        // user: user,
      };
    });
    return carLicensesWithLicenseNumber;
  },
  checkCarExists: async (payload) => {
    try {
      // console.log(payload);
      if (
        !payload.plateNumber ||
        !payload.motorNumber ||
        !payload.chassisNumber ||
        !payload.checkDate ||
        !payload.startDate ||
        !payload.endDate
      ) {
        throw new Error("All fields are required");
      }
      console.log(payload);
      const existingCar = await CarLicense.findOne({
        where: {
          plateNumber: payload.plateNumber,
          motorNumber: payload.motorNumber,
          chassisNumber: payload.chassisNumber,
        },
      });
      if (!existingCar) {
        // throw new Error("Vehicle not found");
        if (
          new Date(payload.startDate) > new Date(payload.endDate) ||
          new Date(payload.startDate) > new Date() ||
          new Date(payload.endDate) < new Date()
        ) {
          throw new Error("Invalid date range");
        }
        if (new Date(payload.checkDate) < new Date()) {
          throw new Error("Invalid check date");
        }
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  editDrivingLicense: async (id, payload) => {
    console.log(payload);
    const drivingLicense = await DrivingLicense.findOne({
      where: { id: id },
    });
    if (!drivingLicense) {
      throw new Error("Driving license not found");
    }
    const keys = Object.keys(payload);
    const updates = {};
    keys.forEach((key) => {
      if (key !== "startDate" && key !== "endDate") {
        updates[key] = payload[key];
      } else {
        updates[key] = new Date(payload[key]);
      }
    });
    await drivingLicense.update(updates);
    return "Driving license updated successfully";
  },
  deleteDrivingLicense: async (id) => {
    const drivingLicense = await DrivingLicense.findOne({
      where: { id: id },
    });
    if (!drivingLicense) {
      throw new Error("Driving license not found");
    }
    await drivingLicense.destroy();
    return "Driving license deleted successfully";
  },
  addCarLicense: async (payload) => {
    console.log("here");
    console.log(payload);
    if (
      !payload.brand ||
      !payload.model ||
      !payload.year ||
      !payload.bodyType ||
      !payload.engineType ||
      !payload.engineCylinder ||
      !payload.engineSize ||
      !payload.plateNumber ||
      !payload.licenseEndDate ||
      !payload.licenseType ||
      !payload.engineNumber ||
      !payload.chassisNumber ||
      !payload.color ||
      !payload.checkDate ||
      !payload.nationalId ||
      !payload.userName
      // !payload.trafficUnit
    ) {
      throw new Error("All fields are required");
    }

    const car = await Car.findOne({
      where: {
        maker: payload.brand,
        model: payload.model,
        year: payload.year,
        engineType: payload.engineType,
        engineCylinders: payload.engineCylinder,
        engineSize: payload.engineSize,
        bodyType: payload.bodyType,
      },
    });
    if (!car) {
      throw new Error("Car not found");
    }
    const carStartDate = new Date();
    const carEndDate = new Date(payload.licenseEndDate);
    console.log(carEndDate);
    const carCheckDate = new Date(payload.checkDate);
    if (carStartDate >= carEndDate) {
      throw new Error("Invalid dates");
    }
    if (carEndDate < new Date()) {
      throw new Error("Car license is expired");
    }
    if (carCheckDate < new Date()) {
      throw new Error("Car check date is expired");
    }
    const user = await User.findOne({
      where: { nationalId: payload.nationalId },
    });

    try {
      const carLicense = await CarLicense.create({
        userId: user ? user.id : null,
        nationalId: payload.nationalId,
        userName: payload.userName,
        vehicleId: car.id,
        plateNumber: payload.plateNumber,
        startDate: carStartDate,
        endDate: carEndDate,
        licenseType: payload.licenseType,
        motorNumber: payload.engineNumber,
        chassisNumber: payload.chassisNumber,
        carColor: payload.color,
        checkDate: carCheckDate,
        trafficUnit: payload.trafficUnit,
      });
      await carLicense.save();
    } catch (error) {
      console.log(error);
    }
    return "Car license added successfully";
  },
  editCarLicense: async (id, payload) => {
    const carLicense = await CarLicense.findOne({ where: { plateNumber: id } });
    if (!carLicense) {
      throw new Error("Car license not found");
    }
    console.log(payload);
    const keys = Object.keys(payload);
    console.log(keys);
    const updates = {};
    keys.forEach((key) => {
      if (key !== "startDate" && key !== "endDate") {
        updates[key] = payload[key];
      } else {
        updates[key] = new Date(payload[key]);
      }
    });
    await carLicense.update(updates);
    return "Car license updated successfully";
  },
  deleteCarLicense: async (id) => {
    const carLicense = await CarLicense.findOne({ where: { plateNumber: id } });
    if (!carLicense) {
      throw new Error("Car license not found");
    }
    await carLicense.destroy();
    return "Car license deleted successfully";
  },
  getAllCourses: async () => {
    const coursesRequests = await Request.findAll({
      where: { type: "course", status: "pending" },
    });
    const courses = await Promise.all(
      coursesRequests.map(async (course) => {
        const user = await User.findOne({
          where: { id: course.userId },
        });
        return {
          id: course.requestId,
          requestDate: course.requestDate,
          status: course.status,
          userId: user.id,
          nationalId: user.nationalId,
          userName: user.name,
          paymentStatus: course.paymentStatus,
          paymentImage: course.paymentImage,
        };
      })
    );
    return courses;
  },
  approveCourse: async (id) => {
    const course = await Request.findOne({ where: { requestId: id } });
    if (!course) {
      throw new Error("Course request not found");
    }
    course.status = "approved";
    course.paymentStatus = "paid";
    await course.save();
    await Notification.create({
      userId: course.userId,
      title: "Course Request Approved",
      description: "Your course request has been approved",
    });
    return "Course request approved successfully";
  },
  declineCourse: async (id) => {
    const course = await Request.findOne({ where: { requestId: id } });
    if (!course) {
      throw new Error("Course request not found");
    }
    course.status = "rejected";
    course.paymentStatus = "unpaid";
    await course.save();
    await Notification.create({
      userId: course.userId,
      title: "Course Request Declined",
      description: "Your course request has been declined",
    });
    return "Course request rejected successfully";
  },
  getAllExamRequests: async () => {
    const examRequests = await Request.findAll({
      where: { type: "exam", status: "pending", examType: "theoretical" },
    });
    const exams = await Promise.all(
      examRequests.map(async (exam) => {
        const user = await User.findOne({
          where: { id: exam.userId },
        });
        return {
          id: exam.requestId,
          requestDate: exam.requestDate,
          status: exam.status,
          userId: user.id,
          userName: user.name,
          examType: exam.examType,
          type: exam.type,
        };
      })
    );
    return exams;
  },
  approveExamRequest: async (id) => {
    const exam = await Request.findOne({ where: { requestId: id } });
    if (!exam) {
      throw new Error("Exam request not found");
    }
    exam.status = "approved";
    await exam.save();
    await Notification.create({
      userId: exam.userId,
      title: "Exam Request Approved",
      description: "Your exam request has been approved",
    });
    return "Exam request approved successfully";
  },
  declineExamRequest: async (id) => {
    const exam = await Request.findOne({ where: { requestId: id } });
    if (!exam) {
      throw new Error("Exam request not found");
    }
    exam.status = "rejected";
    await exam.save();
    await Notification.create({
      userId: exam.userId,
      title: "Exam Request Declined",
      description: "Your exam request has been declined",
    });
    return "Exam request rejected successfully";
  },
  getAllPracticalExamRequests: async () => {
    const examRequests = await Request.findAll({
      where: { type: "exam", status: "pending", examType: "practical" },
    });
    const exams = await Promise.all(
      examRequests.map(async (exam) => {
        const user = await User.findOne({
          where: { id: exam.userId },
        });
        return {
          id: exam.requestId,
          requestDate: exam.requestDate,
          status: exam.status,
          userId: user.id,
          userNationalId: user.nationalId,
          userName: user.name,
          examType: exam.examType,
          type: exam.type,
        };
      })
    );
    return exams;
  },
  getAllExamDates: async () => {
    const now = new Date();

    // Step 1: Mark expired approved exams as 'completed'
    await Request.update(
      { status: "completed" },
      {
        where: {
          type: "exam",
          status: "approved",
          endDate: { [Op.lt]: now },
        },
      }
    );

    // Step 2: Fetch only approved exams (i.e., non-expired)
    const examRequests = await Request.findAll({
      where: {
        type: "exam",
        status: "approved",
      },
    });

    // Step 3: Enrich each request with user data
    // const exams = await Promise.all(
    //   examRequests.map(async (exam) => {
    //     const user = await User.findOne({
    //       where: { id: exam.userId },
    //     });

    //     return {
    //       id: exam.requestId,
    //       status: exam.status,
    //       userId: user.id,
    //       userNationalId: user.nationalId,
    //       // userName: user.name,
    //       examType: exam.examType,
    //       type: exam.type,
    //       startDate: exam.startDate,
    //       endDate: exam.endDate,
    //     };
    //   })
    // );
    // return exams;
    return examRequests;
  },
  // getAllExamDates: async () => {
  //   const examRequests = await Request.findAll({
  //     where: { type: "exam", status: "approved" },
  //   });

  //   // await examRequests.forEach(async (exam) => {
  //   //   if (exam.endDate < new Date()) {
  //   //     await Request.update(
  //   //       { status: "completed" },
  //   //       { where: { requestId: exam.requestId } }
  //   //     );
  //   //   }
  //   // });

  //   const exams = await Promise.all(
  //     examRequests.map(async (exam) => {
  //       const user = await User.findOne({
  //         where: { id: exam.userId },
  //       });
  //       return {
  //         id: exam.requestId,
  //         // requestDate: exam.requestDate,
  //         status: exam.status,
  //         userId: user.id,
  //         userNationalId: user.nationalId,
  //         userName: user.name,
  //         examType: exam.examType,
  //         type: exam.type,
  //         startDate: exam.startDate,
  //         endDate: exam.endDate,
  //       };
  //     })
  //   );
  //   return exams;
  // },
  getAllPracticalExamRequestsByNationalId: async (nationalId) => {
    const examRequests = await Request.findAll({
      where: { type: "exam", status: "pending", examType: "practical" },
    });
    const exams = await Promise.all(
      examRequests.map(async (exam) => {
        const user = await User.findOne({
          where: { nationalId: nationalId },
        });
        return {
          id: exam.requestId,
          requestDate: exam.requestDate,
          status: exam.status,
          userId: user.id,
          userNationalId: user.nationalId,
          userName: user.name,
          examType: exam.examType,
          type: exam.type,
        };
      })
    );
    return exams;
  },
  approvePracticalExamRequest: async (id, payload) => {
    const exam = await Request.findOne({ where: { requestId: id } });
    if (!exam) {
      throw new Error("Practical exam request not found");
    }
    exam.status = "approved";
    console.log(payload.startDate);
    console.log(payload.endDate);
    // Convert to UTC before saving
    exam.startDate = new Date(payload.startDate).toISOString();
    exam.endDate = new Date(payload.endDate).toISOString();
    console.log(exam.startDate);
    console.log(exam.endDate);
    await exam.save();

    // For notification, use local time
    const startDateLocal = new Date(payload.startDate).toLocaleString();
    const endDateLocal = new Date(payload.endDate).toLocaleString();

    console.log({ startDateLocal, endDateLocal });

    await Notification.create({
      userId: exam.userId,
      title: "Practical Exam Request Approved",
      description: `Please select a date between ${startDateLocal} and ${endDateLocal} for practical exam and the Traffic Unit.`,
    });

    const returnData = {
      id: exam.requestId,
      status: exam.status,
      userId: exam.userId,
      userNationalId: exam.userNationalId,
      examType: exam.examType,
      type: exam.type,
      startDate: exam.startDate,
      endDate: exam.endDate,
    };
    return returnData;
  },
  // approvePracticalExamRequest: async (id, payload) => {
  //   const exam = await Request.findOne({ where: { requestId: id } });
  //   if (!exam) {
  //     throw new Error("Practical exam request not found");
  //   }
  //   exam.status = "approved";

  //   console.log(payload.startDate);
  //   console.log(payload.endDate);

  //   exam.startDate = payload.startDate;
  //   exam.endDate = payload.endDate;

  //   console.log(exam.startDate);
  //   console.log(exam.endDate);
  //   await exam.save();
  //   await Notification.create({
  //     userId: exam.userId,
  //     title: "Practical Exam Request Approved",
  //     description: `Please select a date between ${payload.startDate} and ${payload.endDate} for practical exam and the Traffic Unit.`,
  //   });
  //   const returnData = {
  //     id: exam.requestId,
  //     status: exam.status,
  //     userId: exam.userId,
  //     userNationalId: exam.userNationalId,
  //     examType: exam.examType,
  //     type: exam.type,
  //     startDate: exam.startDate,
  //     endDate: exam.endDate,
  //   };
  //   return returnData;
  // },
  declinePracticalExamRequest: async (id) => {
    const exam = await Request.findOne({ where: { requestId: id } });
    if (!exam) {
      throw new Error("Practical exam request not found");
    }
    exam.status = "rejected";
    exam.startDate = null;
    exam.endDate = null;
    await exam.save();
    await Notification.create({
      userId: exam.userId,
      title: "Practical Exam Request Declined",
      description: "Your practical exam request has been declined",
    });
    return "Practical exam request rejected successfully";
  },
  scheduleExamDateForNonCreatedUsers: async (payload) => {
    const user = await User.findOne({
      where: { nationalId: payload.nationalId },
    });
    if (user) {
      const exam = await Request.create({
        userId: user.id,
        userNationalId: user.nationalId,
        type: "exam",
        status: "scheduled",
        examType: payload.examType,
        startDate: payload.startDate,
        endDate: payload.endDate,
      });
      await exam.save();
      await Notification.create({
        userId: user.id,
        title: `${payload.examType} Exam Request Approved`,
        description: `Please select a date between ${payload.startDate} and ${payload.endDate} for practical exam and the Traffic Unit.`,
      });
      return "Exam request approved successfully";
    }
    // If user not found, create a new user and schedule the exam
    console.log(payload);
    // const nationalId = payload.nationalId;
    // const gender = nationalId[-1] % 2 === 0 ? "female" : "male";
    // const calculateDOB = nationalId.substring(1, 7);
    // const year = calculateDOB.substring(0, 2);
    // const month = calculateDOB.substring(2, 4);
    // const day = calculateDOB.substring(4, 6);

    // var dob = new Date(
    //   `${nationalId[0] === "2" ? "19" : "20"}${year}-${month}-${day}`
    // );

    // console.log(gender);
    // console.log(payload);

    // const newUser = await User.create({
    //   name: payload.userName,
    //   nationalId: nationalId,
    //   gender: gender,
    //   nationality: "-",
    //   address: "-",
    //   government: "-",
    //   birthDate: dob,
    // });
    // console.log(newUser);
    // if (!newUser) {
    //   throw new Error("User not created");
    // }

    const exam = await Request.create({
      // userId: newUser.id,
      userNationalId: payload.nationalId,
      type: "exam",
      status: "approved",
      examType: payload.examType.toLowerCase(),
      startDate: payload.startDate,
      endDate: payload.endDate,
      userNationalId: payload.nationalId,
    });
    await exam.save();
    return "Exam request approved successfully";
  },

  addTrafficViolation: async (payload) => {
    const requiredFields = [
      "licenseType",
      "licenseId",
      "title",
      "description",
      "date",
      "fineAmount",
    ];

    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new Error("All fields are required!");
      }
    }

    let userId;
    let license;
    let trafficViolation;
    if (payload.licenseType === "drivingLicense") {
      license = await DrivingLicense.findOne({
        where: { licenseNumber: payload.licenseId },
      });
      if (!license) throw new Error("Driving license not found");
      userId = license.userId;
      // Generate a formatted sequential ID (e.g., "0001")
      const lastViolation = await TrafficViolation.findOne({
        order: [["createdAt", "DESC"]],
      });
      const nextId = lastViolation ? lastViolation.violationNumber + 1 : 1;
      console.log(nextId);
      const formattedId = nextId.toString().padStart(4, "0");
      console.log(formattedId);
      trafficViolation = await TrafficViolation.create({
        violationNumber: formattedId,
        title: payload.title,
        description: payload.description,
        type: payload.type,
        date: payload.date,
        fineAmount: payload.fineAmount,
        status: "unpaid",
        drivingLicenseId: license.id,
      });
    } else if (payload.licenseType === "vehicleLicense") {
      license = await VehicleLicense.findOne({
        where: { plateNumber: payload.licenseId },
      });

      if (!license) throw new Error("Vehicle license not found");
      userId = license.userId;
      // Generate a formatted sequential ID (e.g., "0001")
      const lastViolation = await TrafficViolation.findOne({
        order: [["createdAt", "DESC"]],
      });
      const nextId = lastViolation ? lastViolation.violationNumber + 1 : 1;
      console.log(nextId);
      const formattedId = nextId.toString().padStart(4, "0");
      console.log(formattedId);
      trafficViolation = await TrafficViolation.create({
        violationNumber: formattedId,
        title: payload.title,
        description: payload.description,
        type: payload.type,
        date: payload.date,
        fineAmount: payload.fineAmount,
        status: "unpaid",
        vehicleLicenseId: license.plateNumber,
      });
    } else {
      throw new Error("Invalid license type");
    }

    if (userId) {
      await Notification.create({
        userId,
        title: "Traffic Violation",
        description: `You have a new traffic violation: ${payload.title}`,
      });
    }

    return {
      trafficViolation,
      message: "Traffic violation added successfully",
    }; //"Traffic violation added successfully";
  },
  getAllTrafficViolations: async () => {
    return await TrafficViolation.findAll();
  },
  updateTrafficViolation: async (id, payload) => {
    const violation = await TrafficViolation.findByPk(id);
    if (!violation) {
      return "Traffic violation not found";
    }
    await violation.update(payload);
    return "Traffic violation updated successfully";
  },
  deleteTrafficViolation: async (id) => {
    const violation = await TrafficViolation.findByPk(id);
    if (!violation) {
      return "Traffic violation not found";
    }
    await violation.destroy();
    return "Traffic violation deleted successfully";
  },
  getAllLicenseRequests: async () => {
    try {
      const requests = await Request.findAll({
        where: {
          type: ["updateLicense", "replaceLicense"],
          status: "pending",
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      // Use Promise.all to wait for all async operations in the map
      const returnData = await Promise.all(
        requests.map(async (request) => {
          if (request.licenseType === "driving") {
            const drivingLicense = await DrivingLicense.findByPk(
              request.licenseId
            );
            if (drivingLicense) {
              return {
                ...request.dataValues,
                licenseId: `${drivingLicense.licenseType}-${drivingLicense.licenseNumber}`,
              };
            }
          }
          // Return the request dataValues in all cases
          return { ...request.dataValues };
        })
      );

      return returnData;
    } catch (error) {
      console.error("Error fetching license requests:", error);
      throw error;
    }
  },
  approveLicenseRequests: async (requests) => {
    console.log(requests);
    await requests.requestIds.forEach(async (id) => {
      const existingRequest = await Request.findByPk(id);
      if (!existingRequest) {
        throw new Error("License request not found");
      }
      existingRequest.status = "approved";
      await existingRequest.save();
      await Notification.create({
        userId: existingRequest.userId,
        title: "License Request Approved",
        description: "Your license request has been approved",
      });
    });
    return "License request approved successfully";
  },
  rejectLicenseRequest: async (payload) => {
    const existingRequest = await Request.findByPk(payload.requestId);
    if (!existingRequest) {
      throw new Error("License request not found");
    }
    existingRequest.status = "rejected";
    existingRequest.paymentStatus = "unpaid";
    existingRequest.adminNotes = payload.rejectionReason;
    await existingRequest.save();
    await Notification.create({
      userId: existingRequest.userId,
      title: "License Request Declined",
      description: payload.rejectionReason,
    });
    return "License request rejected successfully";
  },
  getAllPendingApprovalPaymentRequests: async () => {
    const requests = await Request.findAll({
      where: {
        status: ["approved", "rejected"],
        type: ["replaceLicense", "updateLicense"],
        paymentStatus: "pending_approval",
      },
      include: [
        {
          model: User,
          as: "user", // Make sure you have the association set up
          attributes: ["id", "name", "email"],
        },
      ],
    });

    const returnData = await Promise.all(
      requests.map(async (request) => {
        if (request.licenseType === "driving") {
          const drivingLicense = await DrivingLicense.findByPk(
            request.licenseId
          );
          if (drivingLicense) {
            return {
              ...request.dataValues,
              licenseId: `${drivingLicense.licenseType}-${drivingLicense.licenseNumber}`,
            };
          }
        }
        // Return the request dataValues in all cases
        return { ...request.dataValues };
      })
    );

    return returnData;
  },
  approvePaymentRequest: async (payload) => {
    await payload.requestIds.forEach(async (id) => {
      const existingRequest = await Request.findByPk(id);
      if (!existingRequest) {
        throw new Error("License request not found");
      }
      existingRequest.status = "completed";
      existingRequest.paymentStatus = "paid";
      await existingRequest.save();
      await Notification.create({
        userId: existingRequest.userId,
        title: "License Payment Request Approved",
        description: "Your license payment request has been approved",
      });
    });
    return "License payment request approved successfully";
  },
  declinePaymentRequest: async (payload) => {
    const existingRequest = await Request.findByPk(payload.requestId);
    if (!existingRequest) {
      throw new Error("License request not found");
    }
    // existingRequest.paymentStatus = "unpaid";
    existingRequest.status = "rejected";
    existingRequest.adminNotes = payload.rejectionReason;
    await existingRequest.save();
    await Notification.create({
      userId: existingRequest.userId,
      title: "License Payment Request Declined",
      description: payload.rejectionReason,
    });
    return "License payment request rejected successfully";
  },
  getAllNewVehicleRequests: async () => {
    try {
      const requests = await PendingCarRequest.findAll({
        where: {
          status: "pending",
        },
        include: [
          {
            model: User,
            // Remove the 'as' property since your association doesn't use it
            attributes: ["id", "name", "email", "nationalId"],
          },
          {
            model: Car, // Changed from Car to Vehicle to match your association
            // Remove the 'as' property since your association doesn't use it
            attributes: ["id", "maker", "model", "year"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return requests.map((request) => ({
        id: request.id,
        userId: request.User?.id, // Access through User (capital U, no alias)
        userName: request.User?.name,
        userEmail: request.User?.email,
        nationalId: request.User?.nationalId,
        vehicleId: request.Vehicle?.id, // Access through Vehicle (capital V, no alias)
        vehicleMake: request.Vehicle?.make,
        vehicleModel: request.Vehicle?.model,
        vehicleYear: request.Vehicle?.year,
        ...request.dataValues,
      }));
    } catch (error) {
      console.error("Error fetching new vehicle requests:", error);
      throw error;
    }
  },
  approveNewVehicleRequest: async (id) => {
    try {
      const request = await PendingCarRequest.findByPk(id);
      if (!request) {
        return "New vehicle request not found";
      }
      request.status = "approved";
      await request.save();
      return "New vehicle request approved successfully";
    } catch (error) {
      console.error("Error approving new vehicle request:", error);
      throw error;
    }
  },
  declineNewVehicleRequest: async (id) => {
    try {
      const request = await PendingCarRequest.findByPk(id);
      if (!request) {
        return "New vehicle request not found";
      }
      request.status = "rejected";
      await request.save();
      return "New vehicle request declined successfully";
    } catch (error) {
      console.error("Error declining new vehicle request:", error);
      throw error;
    }
  },
  // getAllNewVehicleRequests: async () => {
  //   try {
  //     const requests = await PendingCarRequest.findAll({
  //       where: {
  //         status: "pending",
  //       },
  //       include: [
  //         {
  //           model: User,
  //           as: "user",
  //           attributes: ["id", "name", "email"],
  //         },
  //         {
  //           model: Car,
  //           as: "car",
  //         },
  //       ],
  //     });
  //     return requests;
  //   } catch (error) {
  //     console.error("Error fetching new vehicle requests:", error);
  //     throw error;
  //   }
  // },
  //   addMember: async ({ name, email, password, role, permission }) => {
  //     const validationError = await signupProcess({
  //       name,
  //       email,
  //       password,
  //       role,
  //       permission,
  //     });
  //     if (validationError) {
  //       return validationError;
  //       // throw new Error(validationError);
  //     }
  //     password = await utilities.hashPassword(password);
  //     const user = await User.create({
  //       name,
  //       email,
  //       password,
  //       role,
  //     });
  //     if (!user) {
  //       return "Failed to create user!";
  //     }
  //     await user.setPermissions(permission);
  //     // mailer.handleSignup(user.email)
  //     returnData = {
  //       id: user.id,
  //       name: user.name,
  //       email: user.email,
  //       role: user.role,
  //       // verified: user.verified,
  //     };
  //     return returnData;
  //   },
  //   // Function to get Live Diagnostics   Still in progress
  //   getDiagnostics: async () => {
  //     // const data = [];

  //     const diag = await LiveDiagnostics.findAll();
  //     if (!diag || diag.length === 0) {
  //       return "No diagnostics exists!";
  //     }
  //     return diag;
  //   },
  //   markDiagnostics: async (id) => {
  //     const diag = await LiveDiagnostics.findOne({ where: { id } });
  //     if (!diag) {
  //       return "Diagnostics not found";
  //     }
  //     diag.read = true;
  //     await diag.save();
  //     return "Diagnostics marked as read!";
  //   },
  //   deleteDiagnosticsAfter30Days: async () => {
  //     const diagnostics = await LiveDiagnostics.findAll();

  //     const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
  //     const currentTime = Date.now();

  //     diagnostics.forEach(async (diag) => {
  //       const updatedAtTime = new Date(diag.updatedAt).getTime();

  //       if (currentTime - updatedAtTime > thirtyDaysInMilliseconds) {
  //         await LiveDiagnostics.destroy({ where: { id: diag.id } });
  //         console.log(`Deleted diagnostic with ID: ${diag.id}`);
  //       }
  //     });
  //   },

  //   // Function to upload Car Hex Files
  //   addCarUpdate: async ({ file, part, car }) => {
  //     try {
  //       const existCar = await Car.findOne({
  //         where: {
  //           maker: car.maker,
  //           model: car.model,
  //           year: car.year,
  //         },
  //       });
  //       // console.log(existCar);
  //       if (!existCar) {
  //         return "Car not found";
  //       }
  //       if (!file) {
  //         return "No file uploaded.";
  //       }
  //       const binaryData = Buffer.from(file.buffer, "hex");
  //       const base64Data = binaryData.toString("base64");
  //       // existCar.hex.push(file.buffer);
  //       existCar.hex = base64Data;

  //       await existCar.save();
  //       const version = existCar.version;

  //       const fileData = [];
  //       console.log(binaryData.toString());
  //       await fileData.push(binaryData.toString().split("\r\n"));
  //       console.log({ "fileData Before": fileData[0] });
  //       var fileLines = fileData[0].join("\r\n");
  //       console.log({ fileLines: fileLines });
  //       console.log(fileData[0].length);
  //       var EncryptedLines = [];

  //       // console.log({fileData:fileData[0]})

  //       // const allInLine = []
  //       // var fileLines2 = fileData[0].join("\n");
  //       // console.log({fileLines2:fileLines2})
  //       var allInLine ="";
  //       fileData[0].forEach((line) => {
  //         allInLine = allInLine + line;
  //       });
  //         // const allInLine = fileLines.replace("\r\n","");
  //       // fileLines2.forEach(async(line) => {
  //       //   await allInLine.push(line);
  //       // });
  //       console.log({allInLine:allInLine})

  //       const hmacDigest = CryptoJS.HmacSHA256(allInLine, process.env.SECURITY_KEY).toString();

  //       console.log({hmacDigest:hmacDigest})

  // // // Define the input line and the key
  // // var line1 = ":100000000C9473000C94A20B0C94B4060C94CB0BC0";
  // // var key = 'fotaprojectfotaa';

  // // // Encrypt the input line
  // // var encryptedLine = CryptoJS.AES.encrypt(line1, CryptoJS.enc.Utf8.parse(key), {
  // //     mode: CryptoJS.mode.ECB,
  // //     padding: CryptoJS.pad.Pkcs7
  // // }).toString();

  // // Print the input and encrypted line
  // // console.log({line1: line1});
  // // console.log({encryptedLine: encryptedLine});
  //       // console.log(fileData[0])
  //       fileData[0].forEach((line) => {
  //         var ciphertext = CryptoJS.AES.encrypt(line, CryptoJS.enc.Utf8.parse(process.env.SECURITY_KEY), {
  //           mode: CryptoJS.mode.ECB,
  //           padding: CryptoJS.pad.Pkcs7
  //       }).toString();
  //         // console.log({ Ciphertext: ciphertext })
  //         EncryptedLines.push(ciphertext);
  //       });

  //       console.log({ EncryptedLines: EncryptedLines });
  //       var EncryptedLinesString = EncryptedLines.join("\r\n");
  //       console.log(EncryptedLinesString);

  //       // console.log({hmacDigest:CryptoJS.HmacSHA256(":100000000C9473000C94A20B0C94B4060C94CB0BC0\n:100010000C94930D0C94570D0C9490000C9490003C\n:100020000C9490000C9490000C94420C0C942E07AD\n:100030000C9490000C940F0E0C94380E0C94610EDE\n:100040000C9409080C9490000C9490000C9490006F\n:100050000C949000D00099009900990099009900A3\n:1000600099009900990099009900990099009900C8\n:100070009900990099009900AF00F7009900990044\n:10008000AC00B800BE00B500BB0099009900990013\n:1000900099009900990099009900B2009900E30035\n:1000A0001B01ED0009019900990099009900990040\n:1000B0009900990099009900990000019900990010\n:1000C0009900990099009900990099009900990068\n:1000D000990099009900C100990099009900E800E1\n:1000E0002001F200120111241FBECFE5D8E0DEBFCF\n:00000001FF", process.env.SECURITY_KEY).toString()})
  //       // const hmacDigest = Base64.stringify(hmacSHA256(binaryData, process.env.SECURITY_KEY));
  //       // console.log({ hmacDigest: hmacDigest });

  //       // console.log(car);
  //       // await existCar.save();
  //       // console.log(existCar.hex.length);

  //       // console.log(base64Data);
  //       // console.log({ hex: binaryData });
  //       // console.log({ "base64Data:": base64Data });
  //       // function hexToBinary(hexData) {
  //       // const binaryData2 = Buffer.from(base64Data, 'base64');
  //       // console.log({"binaryData2": binaryData2})
  //       // return binaryData;
  //       // }

  //       // // Encrypt
  //       // var ciphertext = CryptoJS.AES.encrypt(
  //       //   base64Data,
  //       //   process.env.SECURITY_KEY
  //       // ).toString();
  //       // console.log({ Ciphertext: ciphertext });
  //       // const binaryEncryptedData = Buffer.from(ciphertext, 'base64');
  //       // console.log({"binaryEncryptedData":binaryEncryptedData})

  //       // // Decrypt
  //       // var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
  //       // var originalText = bytes.toString(CryptoJS.enc.Utf8);

  //       // console.log({"OriginalText":originalText}); // 'my message'
  //       // // console.log(ciphertext);

  //       await firebase.uploadDigest_Storage(
  //         existCar.maker,
  //         existCar.model,
  //         existCar.year,
  //         hmacDigest
  //       );

  //       await firebase.uploadCarUpdate_Storage(
  //         existCar.maker,
  //         existCar.model,
  //         existCar.year,
  //         existCar.hex.length,
  //         EncryptedLinesString
  //       );
  //       await firebase.uploadCarUpdate_RealtimeDB(
  //         existCar.maker,
  //         existCar.model,
  //         existCar.year,
  //         part,
  //         version
  //       );

  //       const users = await existCar.getUsers();
  //       // console.log(users);
  //       users.forEach(async (user) => {
  //         console.log(user.email);
  //         await mailer.sendNotificationUpdate(user.email);
  //       });

  //       return existCar;
  //     } catch (error) {
  //       console.error(error);
  //       return error;
  //     }
  //   },

  //   // Function to upload News
  //   addNews: async ({ news, image }) => {
  //     if (!news) {
  //       return "All fields are required!";
  //     }
  //     if (!image || image.length === 0) {
  //       return "No image uploaded.";
  //     }
  //     const imageURL = await Sirv.uploadImage(image.buffer);
  //     console.log(imageURL);
  //     const CreatedNews = await News.create({
  //       news: news,
  //       image: imageURL,
  //     });
  //     // console.log(news);
  //     return CreatedNews;
  //   },
  //   // Function to delete Member
  //   deleteMember: async (email) => {
  //     const user = await User.findOne({ where: { email } });
  //     if (!user) {
  //       return "User not found";
  //     }
  //     await user.destroy();
  //     return "User deleted successfully";
  //   },
  //   getAllMembers: async () => {
  //     const users = await User.findAll({ where:{ role: 'member'}});
  //     if (!users || users.length === 0) {
  //       return "No Members found!";
  //     }
  //     return users;
  //   },
  //   getUserById: async (id) => {
  //     const user = await User.findOne({ where: { id } });
  //     if (!user) {
  //       return "User not found";
  //     }
  //     return {
  //       id: user.id,
  //       name: user.name,
  //       email: user.email,
  //     };
  //   },
};
// adminServices.deleteDiagnosticsAfter30Days();
module.exports = adminServices;
