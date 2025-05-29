const mailer = require("../functions/nodemailer");
const validator = require("validator");
// const User = require("../models/user");
// const Car = require("../models/car");
const bcrypt = require("bcryptjs");
const utilities = require("../functions/utils");
const Sirv = require("../functions/Sirv");
const sharp = require("sharp");

const User = require("../schemas/user");
const Car = require("../schemas/car");
const DrivingLicense = require("../schemas/drivingLicense");
const CarLicense = require("../schemas/carLicense");
const tableCreation = require("../schemas/tableCreation");
const sequelize = require("../schemas/postgres"); // Adjust path as needed
// const Vehicle = require("../schemas/car");
const PendingCarRequest = require("../schemas/pendingCarRequest");
const Request = require("../schemas/request");
const Notification = require("../schemas/notification");
const ExamQuestion = require("../schemas/examQuestions");
const TrafficViolation = require("../schemas/trafficViolations");
const { CloudHSM } = require("aws-sdk");
// const { default: CarLicense } = require("../../../frontend/src/pages/CarLicenseData");

const signupProcess = async ({
  name,
  email,
  password,
  phone,
  nationalId,
  gender,
  nationality,
  government,
  nationalIdStartDate,
  nationalIdEndDate,
}) => {
  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !nationalId ||
    !gender ||
    !nationality ||
    !government ||
    !nationalIdStartDate ||
    !nationalIdEndDate
  ) {
    return "All fields are required!";
  }
  if (await User.findOne({ where: { email } })) {
    console.error("Email already Taken");
    return "Email Already Exist";
  }
  if (await User.findOne({ where: { phone } })) {
    console.error("Phone already Taken");
    return "Phone already exists";
  }
  if (await User.findOne({ where: { nationalId } })) {
    console.error("National ID already Taken");
    return "National ID already exists";
  }
  // console.log(nationalIdEndDate);
  const date = new Date();
  const nationalIdEndDate2 = new Date(nationalIdEndDate);
  // console.log(date);
  // console.log(nationalIdEndDate2);
  if (nationalIdEndDate2 < date) {
    return "National ID is expired";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters!";
  }
  return null;
};

const loginProcess = async ({ email, password }) => {
  if (!email || !password) {
    return "Email and password are required!";
  }
  return null;
};

const resizeAndCompressImage = async (imageBuffer, quality) => {
  try {
    const resizedImageBuffer = await sharp(imageBuffer)
      // .resize({ width: maxWidth, height: maxHeight, fit: 'inside' }) // Resize the image to fit within maxWidth x maxHeight
      .jpeg({ quality: quality }) // Compress the image as JPEG with specified quality
      .toBuffer(); // Convert the image to a buffer
    return resizedImageBuffer;
  } catch (error) {
    throw new Error("Failed to resize and compress image: " + error.message);
  }
};

const userServices = {
  checkUserData: async (payload) => {
    try {
      console.log(payload);
      if (
        !payload.nationalId ||
        !payload.gender ||
        !payload.nationality ||
        !payload.address ||
        !payload.government ||
        !payload.nationalIdStartDate ||
        !payload.nationalIdEndDate ||
        !payload.name ||
        !payload.password ||
        !payload.email ||
        !payload.phone ||
        !payload.confirmPassword
      ) {
        throw new Error("All fields are required");
      }
      const existingNationalID = await User.findOne({
        where: { nationalId: payload.nationalId },
      });
      if (existingNationalID) {
        throw new Error("National ID already Exists");
      }
      const existingPhoneNumber = await User.findOne({
        where: { phone: payload.phone },
      });
      if (existingPhoneNumber) {
        throw new Error("Phone already Exists");
      }
      if (
        !payload.phone ||
        (payload.phone && payload.phone.length !== 11) ||
        (payload.phone && !/^01\d{9}$/.test(payload.phone))
      ) {
        throw new Error("Invalid phone number format");
      }
      const existingEmail = await User.findOne({
        where: { email: payload.email },
      });
      if (existingEmail) {
        throw new Error("Email already Exists");
      }
      const checkEmail = await validator.isEmail(payload.email);
      if (!checkEmail) {
        throw new Error("Invalid email format");
      }
      if (
        new Date(payload.nationalIdStartDate) >
          new Date(payload.nationalIdEndDate) ||
        new Date(payload.nationalIdStartDate) > new Date()
      ) {
        throw new Error("Invalid date range");
      }
      if (payload.password !== payload.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return null;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  checkCarExists: async (payload) => {
    try {
      // console.log(payload);
      if (
        !payload.plateNumber ||
        !payload.motorNumber ||
        !payload.chassisNumber ||
        !payload.checkDate
        // !payload.startDate ||
        // !payload.endDate
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
        throw new Error("Vehicle not found");
      }
      // const plateNumber = await CarLicense.findOne({
      //   where: { plateNumber: payload.plateNumber },
      // });
      // const motorNumber = await CarLicense.findOne({
      //   where: { motorNumber: payload.motorNumber },
      // });
      // const chassisNumber = await CarLicense.findOne({
      //   where: { chassisNumber: payload.chassisNumber },
      // });
      // if (plateNumber || motorNumber || chassisNumber) {
      //   throw new Error("Car already exists");
      // }
      // if (
      //   new Date(payload.startDate) > new Date(payload.endDate) ||
      //   new Date(payload.startDate) > new Date() ||
      //   new Date(payload.endDate) < new Date()
      // ) {
      //   throw new Error("Invalid date range");
      // }
      // if (new Date(payload.checkDate) < new Date()) {
      //   throw new Error("Invalid check date");
      // }

      return null;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  checkLicenseExists: async (payload) => {
    try {
      console.log({ checkLicenseExists: payload });
      if (
        !payload.licenseNumber ||
        // !payload.licenseStartDate ||
        // !payload.licenseEndDate ||
        !payload.licenseType ||
        !payload.government ||
        !payload.trafficUnit
      ) {
        throw new Error("All fields are required");
      }
      const existingLicense = await DrivingLicense.findOne({
        where: {
          licenseNumber: payload.licenseNumber,
          licenseType: payload.licenseType,
        },
      });
      if (!existingLicense) {
        throw new Error("License not found");
      }
      // const drivingLicense = await DrivingLicense.findOne({
      //   where: { licenseNumber: payload.licenseNumber },
      // });
      // if (drivingLicense) {
      //   throw new Error("Driving license already exists");
      // }
      // if (
      //   new Date(payload.licenseStartDate) > new Date(payload.licenseEndDate) ||
      //   new Date(payload.licenseStartDate) > new Date()
      // ) {
      //   throw new Error("Invalid date range");
      // }
      return null;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  sendOTP: async (email) => {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return "User already exists";
    }
    if (!email) {
      return "Email not found";
    }
    const otp = await mailer.handleSignup(email);
    return otp;
  },
  forgotPassword: async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return "Email not found";
    }
    const otp = await mailer.handleForgotPassword(email);
    return otp;
  },
  resetPassword: async (email, code, password) => {
    const result = await mailer.verifyCode(email, code);
    if (!result) {
      throw new Error("Invalid verification code");
    }
    const user = await User.findOne({ where: { email } });
    user.password = await utilities.hashPassword(password);
    await user.save();
    return user;
  },
  addLicense: async (user, payload) => {
    if (
      !payload.licenseNumber ||
      !payload.startDate ||
      !payload.endDate ||
      !payload.licenseType ||
      !payload.government ||
      !payload.trafficUnit
    ) {
      return "All fields are required!";
    }
    if (
      await DrivingLicense.findOne({
        where: { licenseNumber: payload.licenseNumber },
      })
    ) {
      return "License already exists";
    }

    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);
    if (startDate > endDate || startDate > new Date()) {
      return "Invalid dates";
    }
    if (endDate < new Date()) {
      return "License is expired";
    }
    // Check if user exists
    const userExists = await User.findOne({
      where: { id: user.id },
    });
    if (!userExists) {
      return "User not found";
    }

    const drivingLicense = await DrivingLicense.create({
      licenseNumber: payload.licenseNumber,
      startDate: payload.startDate,
      endDate: payload.endDate,
      licenseType: payload.licenseType,
      userName: user.name,
      trafficUnit: payload.trafficUnit,
      nationalId: user.nationalId,
      userId: userExists.id,
    });
    await drivingLicense.save();
    return drivingLicense;
  },
  addCar: async (user, carLicenseData) => {
    if (
      !carLicenseData.brand ||
      !carLicenseData.model ||
      !carLicenseData.year ||
      !carLicenseData.bodyType ||
      !carLicenseData.engineType ||
      !carLicenseData.engineCylinder ||
      !carLicenseData.engineSize ||
      !carLicenseData.carPlateNumber ||
      !carLicenseData.licenseStartDate ||
      !carLicenseData.licenseEndDate ||
      !carLicenseData.licenseType ||
      !carLicenseData.engineNumber ||
      !carLicenseData.chassisNumber ||
      !carLicenseData.color ||
      !carLicenseData.checkDate ||
      !carLicenseData.trafficUnit
    ) {
      return "All fields are required!";
    }
    const car = await Car.findOne({
      where: {
        maker: carLicenseData.brand,
        model: carLicenseData.model,
        year: carLicenseData.year,
        engineType: carLicenseData.engineType,
        engineCylinders: carLicenseData.engineCylinder,
        engineSize: carLicenseData.engineSize,
        bodyType: carLicenseData.bodyType,
      },
    });
    if (!car) {
      return "Car not found";
    }
    const existCarLicense = await CarLicense.findOne({
      where: { plateNumber: carLicenseData.carPlateNumber },
    });
    if (existCarLicense) {
      return "Car already Linked to another user";
    }
    const carStartDate = new Date(carLicenseData.licenseStartDate);
    const carEndDate = new Date(carLicenseData.licenseEndDate);
    const carCheckDate = new Date(carLicenseData.checkDate);
    if (carStartDate > carEndDate) {
      return "Invalid dates";
    }
    if (carEndDate < new Date()) {
      return "Car license is expired";
    }

    try {
      const carLicense = await CarLicense.create({
        userId: user.id,
        vehicleId: car.id,
        nationalId: user.nationalId,
        userName: user.name,
        plateNumber: carLicenseData.carPlateNumber,
        startDate: carStartDate,
        endDate: carEndDate,
        licenseType: carLicenseData.licenseType,
        motorNumber: carLicenseData.engineNumber,
        chassisNumber: carLicenseData.chassisNumber,
        carColor: carLicenseData.color,
        checkDate: carCheckDate,
        trafficUnit: carLicenseData.trafficUnit,
      });
      await carLicense.save();
    } catch (error) {
      console.log(error);
    }
    return user;
  },
  addCarDataRequest: async (user, car) => {
    // Check if user exists
    const userExists = await User.findOne({
      where: { id: user.id },
    });
    if (!userExists) {
      return "User not found";
    }
    const existCarChassisNumber = await CarLicense.findOne({
      where: { chassisNumber: car.chassisNumber },
    });
    const existCarEngineNumber = await CarLicense.findOne({
      where: { motorNumber: car.engineNumber },
    });
    if (existCarChassisNumber || existCarEngineNumber) {
      return "Car already has License";
    }
    const existCar = await Car.findOne({
      where: {
        maker: car.brand,
        model: car.model,
        year: car.year,
        engineType: car.engineType,
        engineCylinders: car.engineCylinder,
        engineSize: car.engineSize,
        bodyType: car.bodyType,
      },
      // Check if car exists
    });
    if (!existCar) {
      return "Car not found";
    }
    const existCarDataRequest = await PendingCarRequest.findOne({
      where: {
        userId: userExists.id,
        vehicleId: existCar.id,
        status: "pending",
      },
    });
    if (existCarDataRequest) {
      return "Car already requested";
    }
    const carDataRequest = await PendingCarRequest.create({
      userId: user.id,
      vehicleId: existCar.id,
      status: "pending",
      color: car.color,
      licenseType: car.licenseType,
      engineNumber: car.engineNumber,
      chassisNumber: car.chassisNumber,
    });
    await carDataRequest.save();
    return carDataRequest;
  },
  getCarDataRequest: async (user) => {
    const carDataRequest = await PendingCarRequest.findAll({
      where: {
        userId: user.id,
        status: ["approved", "rejected", "pending"],
      },
      include: [
        {
          model: Car,
          // as: "vehicle",
          attributes: [
            "id",
            "maker",
            "model",
            "year",
            "engineType",
            "engineCylinders",
            "engineSize",
            "bodyType",
          ],
        },
      ],
    });
    console.log(carDataRequest);
    return carDataRequest;
  },
  verifyCode: async (email, code) => {
    const result = await mailer.verifyCode(email, code);
    return result;
  },
  createUser: async (payload) => {
    // console.log(payload);
    const calculateDOB = payload.user.nationalId.substring(1, 7);
    const year = calculateDOB.substring(0, 2);
    const month = calculateDOB.substring(2, 4);
    const day = calculateDOB.substring(4, 6);

    var dob = new Date(
      `${
        payload.user.nationalId[0] === "2" ? "19" : "20"
      }${year}-${month}-${day}`
    );
    // console.log({ dob: dob, year: year, month: month, day: day });
    // console.log(dob)
    // const dob = new Date(`20${year}-${month}-${day}`);
    const age = new Date().getFullYear() - dob.getFullYear();
    // console.log(dob);
    // console.log(age);
    if (age < 16) {
      return "You must be 18 years or older to register";
    }

    const validationError = await signupProcess({
      name: payload.user.name,
      email: payload.user.email,
      password: payload.user.password,
      phone: payload.user.phone,
      nationalId: payload.user.nationalId,
      gender: payload.user.gender,
      nationality: payload.user.nationality,
      address: payload.user.address,
      government: payload.user.government,
      nationalIdStartDate: payload.user.nationalIdStartDate,
      nationalIdEndDate: payload.user.nationalIdEndDate,
      birthDate: dob,
    });
    if (validationError) {
      return validationError;
    }

    payload.user.password = await utilities.hashPassword(payload.user.password);
    // payload.verified = true;
    const user = await User.create({
      name: payload.user.name,
      email: payload.user.email,
      password: payload.user.password,
      phone: payload.user.phone,
      nationalId: payload.user.nationalId,
      gender: payload.user.gender,
      nationality: payload.user.nationality,
      address: payload.user.address,
      government: payload.user.government,
      nationalIdStartDate: payload.user.nationalIdStartDate,
      nationalIdEndDate: payload.user.nationalIdEndDate,
      birthDate: dob,
    });

    const token = await utilities.generateToken(user);
    user.tokens = user.tokens || [];
    user.tokens = user.tokens.concat(token);

    await user.save();
    if (payload.drivingLicense) {
      const drivingLicense = await DrivingLicense.findOne({
        where: {
          licenseNumber: payload.drivingLicense.licenseNumber,
          licenseType: payload.drivingLicense.licenseType,
          nationalId: user.nationalId,
        },
      });
      if (!drivingLicense) {
        // return "Driving license already exists";
        throw new Error("Driving license Does not exists");
      }

      const startDate = new Date(payload.drivingLicense.startDate);
      const endDate = new Date(payload.drivingLicense.endDate);
      if (startDate > endDate) {
        return "Invalid dates";
      }
      if (endDate < new Date()) {
        return "Driving license is expired";
      }

      // try {
      //   const drivingLicense = await DrivingLicense.create({
      //     userName: user.name,
      //     nationalId: user.nationalId,
      //     userId: user.id,
      //     licenseNumber: payload.drivingLicense.licenseNumber,
      //     licenseType: payload.drivingLicense.licenseType,
      //     trafficUnit: payload.drivingLicense.trafficUnit,
      //     startDate: startDate,
      //     endDate: endDate,
      //   });
      //   await drivingLicense.save();
      // } catch (error) {
      //   console.log(error);
      // }

      drivingLicense.userId = user.id;
      await drivingLicense.save();
    }
    if (payload.carLicense) {
      const car = await Car.findOne({
        where: {
          maker: payload.carLicense.brand,
          model: payload.carLicense.model,
          year: payload.carLicense.year,
          engineType: payload.carLicense.engineType,
          engineCylinders: payload.carLicense.engineCylinder,
          engineSize: payload.carLicense.engineSize,
          bodyType: payload.carLicense.bodyType,
        },
      });
      if (!car) {
        return "Car not found";
      }
      const existCarLicense = await CarLicense.findOne({
        where: {
          plateNumber: payload.carLicense.carPlateNumber,
          nationalId: user.nationalId,
          vehicleId: car.id,
        },
      });
      if (!existCarLicense) {
        // return "Car already Linked to another user";
        throw new Error("Car license Does not exists");
      }

      const carStartDate = new Date(payload.carLicense.licenseStartDate);
      const carEndDate = new Date(payload.carLicense.licenseEndDate);
      const carCheckDate = new Date(payload.carLicense.checkDate);
      if (carStartDate > carEndDate) {
        return "Invalid dates";
      }
      if (carEndDate < new Date()) {
        return "Car license is expired";
      }

      // try {
      //   const carLicense = await CarLicense.create({
      //     userId: user.id,
      //     userName: user.name,
      //     nationalId: user.nationalId,
      //     vehicleId: car.id,
      //     plateNumber: payload.carLicense.carPlateNumber,
      //     startDate: carStartDate,
      //     endDate: carEndDate,
      //     licenseType: payload.carLicense.licenseType,
      //     motorNumber: payload.carLicense.engineNumber,
      //     chassisNumber: payload.carLicense.chassisNumber,
      //     carColor: payload.carLicense.color,
      //     checkDate: carCheckDate,
      //     trafficUnit: payload.carLicense.trafficUnit,
      //   });
      //   await carLicense.save();
      // } catch (error) {
      //   console.log(error);
      // }
      console.log(existCarLicense);
      console.log(user.id);
      existCarLicense.userId = user.id;
      await existCarLicense.save();
    }
    // await mailer.handleSignup(user.email);
    const returnData = {
      id: user.id,
      nationalId: user.nationalId,
      name: user.name,
      email: user.email,
      // verified: user.verified,
      role: user.role,
      tokens: user.tokens,
    };
    return { user: returnData, token };
  },
  loginUser: async (email, password) => {
    const validationError = await loginProcess({ email, password });
    if (validationError) {
      return validationError;
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid Email or Password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid Email or Password");
    }
    // const permissions = await user.getPermissions();
    // const plainPermissions = permissions.map(
    //   (permission) => permission.get({ plain: true }).id
    // );
    const token = await utilities.generateToken(user);
    user.tokens = user.tokens || [];
    user.tokens = user.tokens.concat(token);
    await user.save();
    const returnData = {
      id: user.id,
      nationalId: user.nationalId,
      name: user.name,
      email: user.email,
      // verified: user.verified,
      role: user.role,
      tokens: user.tokens,
    };
    console.log(returnData);
    return { user: returnData, token };
  },
  verifyUser: async (email, verifyCode) => {
    const result = await mailer.handleVerification(email, verifyCode);
    if (result === false) {
      throw new Error("Invalid Verification Code");
    }
    // user.verified = true;
    await user.save();
    return user;
  },
  logoutUser: async (user, token) => {
    console.log(user.tokens);
    const userToken = [];
    user.tokens.forEach((t) => {
      if (t !== token) {
        userToken.push(t);
      }
    });
    user.tokens = userToken;
    console.log(user.tokens);
    await user.save();
    return user;
  },
  logoutAllUsers: async (user) => {
    user.tokens = [];
    await user.save();
    return user;
  },
  getProfile: async (user) => {
    return user;
  },
  updateUser: async (user, payload) => {
    const updates = Object.keys(payload);
    const allowedUpdates = ["name", "password", "phone", "address"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      return "Invalid updates!";
    }
    if (updates.includes("phone")) {
      const existingUser = await User.findOne({
        where: { phone: payload.phone },
      });
      if (existingUser && existingUser.email !== user.email) {
        return "Phone already exists";
      }
    }

    updates.forEach(async (update) => {
      if (update === "password") {
        user.password = await utilities.hashPassword(payload[update]);
        await user.save();
      } else {
        user[update] = payload[update];
      }
    });
    await user.save();
    return user;
  },
  deleteUser: async (user) => {
    await user.destroy();
    return user;
  },
  getUserCars: async (user) => {
    const carLicenses = await CarLicense.findAll({
      where: { userId: user.id },
    });
    if (!carLicenses) {
      throw new Error("No cars found");
    }
    const userCars = [];
    for (let i = 0; i < carLicenses.length; i++) {
      const car = await Car.findByPk(carLicenses[i].vehicleId);
      userCars.push(car);
    }
    return [userCars, carLicenses];
  },
  getUserLicense: async (user) => {
    const drivingLicense = await DrivingLicense.findAll({
      where: { userId: user.id },
    });
    if (!drivingLicense || drivingLicense.length === 0) {
      throw new Error("No driving license found");
    }
    return drivingLicense;
  },
  removeCar: async (user, payload) => {
    const carLicense = await CarLicense.findOne({
      where: {
        userId: user.id,
        plateNumber: payload.plateNumber,
      },
    });
    if (!carLicense) {
      throw new Error("Car license not found");
    }
    await carLicense.destroy();
    return user;
  },
  addCarToUser: async (user, car) => {
    const userCar = await Car.findOne({
      where: {
        model: car.model,
        maker: car.maker,
        year: car.year,
      },
    });
    if (!userCar) {
      throw new Error("Car not found");
    }
    const userCars = await user.getCars();
    userCars.forEach((c) => {
      console.log(c.id, userCar.id, c.plateNumber, car.plateNumber);
      if (c.id === userCar.id && c.plateNumber === car.plateNumber) {
        throw new Error("Car already exists in user's list");
      }
    });
    await user.addCar(userCar);
    return user;
  },
  removeCarFromUser: async (user, car) => {
    const userCar = await Car.findOne({
      where: {
        model: car.model,
        maker: car.maker,
        year: car.year,
      },
    });
    if (!userCar) {
      throw new Error("Car not found");
    }
    const userCars = await user.getCars();

    const carExists = userCars.some((c) => c.id === userCar.id);
    if (!carExists) {
      throw new Error("Car not found in user's list");
    }
    user.removeCar(userCar);
    return user;
  },
  uploadAvatar: async (user, avatar) => {
    // const image = await Sirv.uploadImage(avatar.buffer);
    try {
      const resizedAvatar = await resizeAndCompressImage(avatar.buffer, 100); // Resize to maximum dimensions of 200x200 with 60% quality
      const image = await Sirv.uploadImage(resizedAvatar); // Upload the resized and compressed image to Sirv
      user.avatar = image;
      await user.save();
    } catch (error) {
      console.error(error);
    }
    return user;
  },
  replaceAvatar: async (user, avatar) => {
    if (!avatar) {
      return "No image to replace with";
    }
    const oldAvatar = user.avatar;
    const resizedAvatar = await resizeAndCompressImage(avatar.buffer, 100); // Resize to maximum dimensions of 200x200 with 60% quality
    const newAvatar = await Sirv.replaceImage(oldAvatar, resizedAvatar); // Replace the old avatar with the new one
    // const newAvatar = await Sirv.replaceImage(oldAvatar, avatar.buffer);
    user.avatar = newAvatar;
    await user.save();
    return user;
  },
  deleteAvatar: async (user) => {
    if (!user.avatar) {
      return "No avatar to delete";
    }
    user.avatar = null;
    await user.save();
    return "Avatar deleted";
  },
  getAvatar: async (id) => {
    const user = await User.findByPk(id);
    if (!user || !user.avatar) {
      throw new Error("No avatar found");
    }
    return user.avatar;
  },
  requestDrivingLicenseCourse: async (user, file) => {
    const drivingLicense = await Request.findOne({
      where: { userId: user.id, status: "pending", type: "course" },
    });
    if (drivingLicense) {
      return "You already have a pending request for a driving license course";
    }
    const resizedImage = await resizeAndCompressImage(file.buffer, 100);
    const imageUrl = await Sirv.uploadImage(resizedImage);

    // Create request
    return await Request.create({
      userId: user.id,
      userNationalId: user.nationalId,
      type: "course",
      licenseType: "driving",
      status: "pending",
      paymentStatus: "pending_approval",
      paymentImage: imageUrl,
    });
    // const resizedImage = await resizeAndCompressImage(file.buffer, 100);
    // const image = await Sirv.uploadImage(resizedImage);
    // const request = await Request.create({
    //   userId: user.id,
    //   userNationalId: user.nationalId,
    //   type: "course",
    //   licenseType: "driving",
    //   status: "pending",
    //   paymentImage: image,
    // });
    return request;
  },
  checkDrivingLicenseCourseRequest: async (user) => {
    const request = await Request.findOne({
      where: { userId: user.id, status: "pending", type: "course" },
    });
    if (!request) {
      return true; // No pending request found
    }
    return false; // Pending request exists
  },
  getUserNotifications: async (user) => {
    const notifications = await Notification.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });
    if (!notifications) {
      throw new Error("No notifications found");
    }
    return notifications;
  },
  markUserNotifications: async (user, notificationId) => {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId: user.id },
    });
    if (!notification) {
      throw new Error("No notification found");
    }
    notification.status = "read";
    await notification.save();
    return notification;
  },
  markAllNotificationsAsRead: async (user) => {
    const result = await Notification.update(
      { status: "read" },
      { where: { userId: user.id, status: "unread" } }
    );
    return result[0]; // Returns number of affected rows
  },
  clearAllNotifications: async (user) => {
    await Notification.destroy({
      where: { userId: user.id },
    });
    return true;
  },
  // Still need to fix this function
  deleteUserNotification: async (user, notificationId) => {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId: user.id },
    });
    if (!notification) {
      throw new Error("No notification found");
    }
    await notification.destroy();
    return true;
  },
  checkCourseApproval: async (user) => {
    const courseApproval = await Request.findOne({
      where: { userId: user.id, status: "approved", type: "course" },
    });
    if (!courseApproval) {
      return false; // Course not approved
    }
    return true; // Course approved
  },
  requestDrivingLicenseExam: async (user) => {
    var drivingLicense = await Request.findOne({
      where: {
        userId: user.id,
        status: "pending",
        type: "exam",
        examType: "theoretical",
      },
    });
    if (drivingLicense) {
      return "You already have a pending request for a driving license exam";
    }
    const courseApproval = await Request.findOne({
      where: { userId: user.id, status: "approved", type: "course" },
    });
    if (courseApproval) {
      await courseApproval.update({ status: "completed" });
      await courseApproval.save();
    }
    const request = await Request.create({
      userId: user.id,
      userNationalId: user.nationalId,
      type: "exam",
      status: "pending",
      examType: "theoretical",
    });
    return request;
  },
  checkDrivingLicenseExamRequest: async (user) => {
    const request = await Request.findOne({
      where: {
        userId: user.id,
        status: "pending",
        type: "exam",
        examType: "theoretical",
      },
    });
    if (!request) {
      return true; // No pending request found
    }
    return false; // Pending request exists
  },
  checkDrivingLicenseExamApproval: async (user) => {
    const request = await Request.findOne({
      where: {
        userId: user.id,
        status: "approved",
        type: "exam",
        examType: "theoretical",
      },
    });
    if (!request) {
      return false; // Exam not approved
    }
    const currentDate = new Date();
    const deadline = new Date(request.updatedAt);
    deadline.setDate(deadline.getDate() + 5); // Add 5 days to the updated date
    if (currentDate > deadline) {
      return { approved: false, deadline: request.updatedAt }; // Exam expired
    }
    console.log(currentDate, deadline);
    return { approved: true, deadline: deadline }; // Exam approved
  },
  getDrivingLicenseExamQuestions: async (user) => {
    try {
      // Validate user if needed (uncomment if required)
      // if (!user || !user.id) {
      //     throw new Error("Invalid user");
      // }

      const questions = await ExamQuestion.findAll({
        order: sequelize.random(),
        limit: 20,
        attributes: [
          "questionId",
          "questionText",
          "optionA",
          "optionB",
          "optionC",
          "optionD",
          "correctAnswer",
        ],
      });

      if (!questions || questions.length === 0) {
        throw new Error("No questions found");
      }

      return questions.map((question) => ({
        id: question.questionId,
        question: question.questionText,
        options: [
          question.optionA,
          question.optionB,
          question.optionC,
          question.optionD,
        ].filter((option) => option !== null), // Filter out null options if any
        correctAnswer: question.correctAnswer, // Changed from 'answer' to 'correctAnswer' for clarity
      }));
    } catch (error) {
      console.error("Error fetching exam questions:", error);
      throw error; // Re-throw the error for the calling function to handle
    }
  },
  requestPracticalDrivingLicenseExam: async (user, payload) => {
    const theoreticalApproval = await Request.findOne({
      where: {
        userId: user.id,
        status: "approved",
        type: "exam",
        examType: "theoretical",
      },
    });
    console.log(theoreticalApproval);
    // Case: No approved theoretical exam found
    if (!theoreticalApproval) {
      // return "You must pass the theoretical exam before requesting the practical exam";
      throw new Error(
        "You must pass the theoretical exam before requesting the practical exam"
      );
    }

    // Case: Score < 60 → Mark theoretical exam as failed
    if (payload.score < 60) {
      theoreticalApproval.status = "failed";
      await theoreticalApproval.save();
      await Notification.create({
        userId: user.id,
        title: "Theoretical Exam Failed",
        description:
          "Theoretical exam failed. You cannot retake the exam for 30 days.",
      });
      // return "You must pass the theoretical exam.";
      throw new Error(
        "You must pass the theoretical exam before requesting the practical exam"
      );
    }

    // Case: Score >= 60 → Proceed to practical exam
    theoreticalApproval.status = "completed";
    await theoreticalApproval.save();

    const existingPracticalRequest = await Request.findOne({
      where: {
        userId: user.id,
        status: "pending",
        type: "exam",
        examType: "practical",
      },
    });

    if (existingPracticalRequest) {
      // return "You already have a pending request for a practical driving license exam";
      throw new Error(
        "You already have a pending request for a practical driving license exam"
      );
    }

    // Create new practical exam request
    const request = await Request.create({
      userId: user.id,
      userNationalId: user.nationalId,
      type: "exam",
      status: "pending",
      examType: "practical",
    });

    return request;
  },
  checkPracticalDrivingLicenseExamRequest: async (user) => {
    const request = await Request.findOne({
      where: {
        userId: user.id,
        status: "approved",
        type: "exam",
        examType: "practical",
      },
    });
    if (!request) {
      return false; // No pending request found
    }
    return {
      approved: true,
      startDate: request.startDate,
      endDate: request.endDate,
    }; // Pending request exists
  },
  choosePracticalDrivingLicenseExamDate: async (user, payload) => {
    const request = await Request.findOne({
      where: {
        userId: user.id,
        status: "approved",
        type: "exam",
        examType: "practical",
      },
    });
    if (!request) {
      throw new Error(
        "No approved practical driving license exam request found"
      );
    }
    if (request.scheduledDate) {
      throw new Error("Date already selected");
    }
    const currentDate = new Date();
    const selectedDate = new Date(payload.scheduledDate);
    if (selectedDate < currentDate) {
      throw new Error("Selected date is in the past");
    }
    if (selectedDate > request.endDate) {
      throw new Error("Selected date is after the end date of the request");
    }
    if (selectedDate < request.startDate) {
      throw new Error("Selected date is before the start date of the request");
    }
    request.scheduledDate = selectedDate;
    await request.save();
    return request;
  },
  checkCoursePermission: async (user) => {
    const courseApproval = await Request.findOne({
      where: { userId: user.id, status: "approved", type: "course" },
    });
    if (!courseApproval) {
      return false; // Course not approved
    }
    return true; // Course approved
  },
  checkExamPermission: async (user) => {
    const examApproval = await Request.findOne({
      where: {
        userId: user.id,
        status: "approved",
        type: "exam",
        examType: "theoretical",
      },
    });
    if (!examApproval) {
      return false; // Exam not approved
    }
    return true; // Exam approved
  },
  reRequestDrivingLicenseTheoreticalExam: async (user) => {
    const request = await Request.findOne({
      where: {
        userId: user.id,
        status: "failed",
        type: "exam",
        examType: "theoretical",
      },
    });
    if (!request) {
      // return "You don't have a failed request for a driving license exam";
      throw new Error(
        "You don't have a failed request for a driving license exam"
      );
    }
    const currentDate = new Date();
    const deadline = new Date(request.updatedAt);
    deadline.setDate(deadline.getDate() + 30); // Add 30 days to the updated date
    if (currentDate < deadline) {
      // return "You can only re-request the exam after 30 days from the last request";
      throw new Error(
        "You can only re-request the exam after 30 days from the last request"
      );
    }
    const newRequest = await Request.create({
      userId: user.id,
      userNationalId: user.nationalId,
      type: "exam",
      status: "pending",
      examType: "theoretical",
      requestedDate: currentDate,
    });
    await request.destroy(); // Delete the old request
    await newRequest.save();
    return newRequest;
  },

  check30DaysPassedSinceLastExam: async (user) => {
    const request = await Request.findOne({
      where: {
        userId: user.id,
        status: "failed",
        type: "exam",
        examType: "theoretical",
      },
    });
    if (!request) {
      throw new Error("No failed request found");
    }
    const currentDate = new Date();
    const deadline = new Date(request.updatedAt);
    deadline.setDate(deadline.getDate() + 30); // Add 30 days to the updated date
    // console.log(currentDate, deadline);
    // console.log("remaining time", ((deadline - currentDate) / (1000 * 60 * 60 * 24)).toFixed(0));
    if (currentDate < deadline) {
      return {
        passed: false,
        remainingDays: (
          (deadline - currentDate) /
          (1000 * 60 * 60 * 24)
        ).toFixed(0),
      }; // 30 days not passed
    }
    return { passed: true }; // 30 days passed
  },
  getUserViolations: async (user) => {
    const drivingLicenses = await DrivingLicense.findAll({
      where: { userId: user.id },
    });
    const carLicenses = await CarLicense.findAll({
      where: { userId: user.id },
    });
    const violations = [];
    console.log(drivingLicenses.length, carLicenses.length);
    for (let i = 0; i < drivingLicenses.length; i++) {
      const drivingLicense = drivingLicenses[i];
      const drivingViolation = await TrafficViolation.findAll({
        where: { drivingLicenseId: drivingLicense.id },
      });
      if (drivingViolation) {
        drivingViolation.forEach((v) => {
          violations.push(v);
        });
      }
    }
    for (let i = 0; i < carLicenses.length; i++) {
      const carLicense = carLicenses[i];
      const vehicleViolation = await TrafficViolation.findAll({
        where: { vehicleLicenseId: carLicense.plateNumber },
      });
      if (vehicleViolation) {
        // violations.push(vehicleViolation);
        vehicleViolation.forEach((v) => {
          violations.push(v);
        });
      }
    }
    if (violations.length === 0) {
      return "No violations found";
    }
    // console.log(violations);
    return violations;
  },
  createLicenseRequest: async (user, payload, files) => {
    if (
      !payload.requestType ||
      !payload.selectedLicense ||
      !payload.licenseType ||
      !files.idFrontImage ||
      !files.idBackImage
    ) {
      throw new Error("All fields are required");
    }

    var vehicle;
    var drivingLicense;
    if (payload.licenseType === "vehicle") {
      console.log(payload.selectedLicense);
      console.log(
        await CarLicense.findOne({
          where: { plateNumber: payload.selectedLicense },
        })
      );
      vehicle = await CarLicense.findOne({
        where: {
          plateNumber: payload.selectedLicense,
        },
      });
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }
    }
    if (payload.licenseType === "driving") {
      drivingLicense = await DrivingLicense.findOne({
        where: {
          licenseType: payload.selectedLicense.split("-")[0],
          licenseNumber: payload.selectedLicense.split("-")[1],
        },
      });
      if (!drivingLicense) {
        throw new Error("Driving license not found");
      }
    }
    console.log(payload);
    console.log("LicenseType value:", payload.licenseType);

    const request = await Request.create({
      userId: user.id,
      userNationalId: user.nationalId,
      type: payload.requestType,
      licenseType: payload.licenseType,
      status: "pending",
      requestedDate: payload.requestDate,
      licenseId:
        payload.licenseType === "driving"
          ? drivingLicense.id
          : vehicle.plateNumber,
    });
    if (files.idFrontImage) {
      const resizedIdFrontImage = await resizeAndCompressImage(
        files.idFrontImage[0].buffer,
        100
      );
      const idFrontImage = await Sirv.uploadImage(
        resizedIdFrontImage,
        "idFrontImage"
      );
      request.idFrontImage = idFrontImage;
    }
    if (files.idBackImage) {
      const resizedIdBackImage = await resizeAndCompressImage(
        files.idBackImage[0].buffer,
        100
      );
      const idBackImage = await Sirv.uploadImage(
        resizedIdBackImage,
        "idBackImage"
      );
      request.idBackImage = idBackImage;
    }
    await request.save();
    return request;
  },
  getLicenseRequests: async (user) => {
    try {
      // Find all approved unpaid license requests for the user
      const approvedLicenseRequests = await Request.findAll({
        where: {
          userId: user.id,
          status: "approved",
          type: ["updateLicense", "replaceLicense"],
          // paymentStatus: "unpaid",
        },
        raw: true, // Get plain objects instead of Sequelize instances
      });
      console.log(approvedLicenseRequests);
      // Process each request to get license number if it's a driving license
      const processedRequests = await Promise.all(
        approvedLicenseRequests.map(async (request) => {
          // Create a copy of the request to avoid modifying the original
          const requestData = { ...request };

          if (request.licenseType === "driving" && request.licenseId) {
            const drivingLicense = await DrivingLicense.findOne({
              where: { id: request.licenseId },
              attributes: ["licenseNumber", "licenseType"], // Only get the needed field
            });
            if (drivingLicense) {
              requestData.licenseId =
                drivingLicense.licenseType + "-" + drivingLicense.licenseNumber;
            }
          }

          // For vehicle licenses, we might want to get vehicle details similarly
          // if (request.licenseType === "vehicle" && request.licenseId) {
          //     const vehicle = await Vehicle.findOne({...});
          // }

          return requestData;
        })
      );

      return processedRequests;
    } catch (error) {
      console.error("Error fetching license requests:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },
  getLicensePaymentRequests: async (user) => {
    try {
      // Find all approved unpaid license requests for the user
      const approvedLicenseRequests = await Request.findAll({
        where: {
          userId: user.id,
          status: "completed",
          type: ["updateLicense", "replaceLicense"],
          paymentStatus: "paid",
        },
        raw: true, // Get plain objects instead of Sequelize instances
      });
      console.log(approvedLicenseRequests);
      const processedRequests = await Promise.all(
        approvedLicenseRequests.map(async (request) => {
          // Create a copy of the request to avoid modifying the original
          const requestData = { ...request };

          if (request.licenseType === "driving" && request.licenseId) {
            const drivingLicense = await DrivingLicense.findOne({
              where: { id: request.licenseId },
              attributes: ["licenseNumber", "licenseType"], // Only get the needed field
            });
            if (drivingLicense) {
              requestData.licenseId =
                drivingLicense.licenseType + "-" + drivingLicense.licenseNumber;
            }
          }

          // For vehicle licenses, we might want to get vehicle details similarly
          // if (request.licenseType === "vehicle" && request.licenseId) {
          //     const vehicle = await Vehicle.findOne({...});
          // }

          return requestData;
        })
      );
      return processedRequests;
    } catch (error) {
      console.error("Error fetching license requests:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },
  getLicensePaymentRejected: async (user) => {
    try {
      // Find all approved unpaid license requests for the user
      const rejectedLicenseRequests = await Request.findAll({
        where: {
          userId: user.id,
          status: "rejected",
          type: ["updateLicense", "replaceLicense"],
          paymentStatus: "unpaid",
        },
        raw: true, // Get plain objects instead of Sequelize instances
      });
      const processedRequests = await Promise.all(
        rejectedLicenseRequests.map(async (request) => {
          // Create a copy of the request to avoid modifying the original
          const requestData = { ...request };

          if (request.licenseType === "driving" && request.licenseId) {
            const drivingLicense = await DrivingLicense.findOne({
              where: { id: request.licenseId },
              attributes: ["licenseNumber", "licenseType"], // Only get the needed field
            });
            if (drivingLicense) {
              requestData.licenseId =
                drivingLicense.licenseType + "-" + drivingLicense.licenseNumber;
            }
          }

          // For vehicle licenses, we might want to get vehicle details similarly
          // if (request.licenseType === "vehicle" && request.licenseId) {
          //     const vehicle = await Vehicle.findOne({...});
          // }

          return requestData;
        })
      );
      // console.log(rejectedLicenseRequests);
      return processedRequests;
    } catch (error) {
      console.error("Error fetching license requests:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  },
  uploadLicensePayment: async (user, file, id) => {
    try {
      console.log(id);
      const request = await Request.findOne({
        where: {
          requestId: id, // Changed from requestId to id if that's your primary key
          userId: user.id,
          paymentStatus: "unpaid",
        },
      });

      if (!request) {
        throw new Error("No unpaid request found with this ID");
      }

      const resizedPaymentImage = await resizeAndCompressImage(
        file.buffer,
        100
      );
      const paymentImage = await Sirv.uploadImage(
        resizedPaymentImage,
        "paymentImage"
      );

      await request.update({
        paymentImage,
        paymentStatus: "pending_approval",
      });

      return request;
    } catch (error) {
      console.error("Error uploading license payment:", error);
      throw error;
    }
  },
  // uploadLicensePayment: async (user, file, payload) => {
  //   console.log(payload);
  //   console.log(file);

  //   try {
  //     if (!file) {
  //       throw new Error("Payment image is required");
  //     }

  //     const request = await Request.findOne({
  //       where: { requestId: payload.requestId, userId: user.id, paymentStatus: "unpaid" },
  //     });
  //     if (!request) {
  //       throw new Error("No request found");
  //     }

  //     const resizedPaymentImage = await resizeAndCompressImage(
  //       file.buffer,
  //       100
  //     );
  //     const paymentImage = await Sirv.uploadImage(
  //       resizedPaymentImage,
  //       "paymentImage"
  //     );
  //     request.paymentImage = paymentImage;
  //     request.paymentStatus = "pending_approval";
  //     await request.save();

  //     return request;
  //   } catch (error) {
  //     console.error("Error uploading license payment:", error);
  //     throw error; // Re-throw the error to handle it in the calling function
  //   }
  // },
  // getLicenseRequests: async (user) => {
  //   const approvedLicenseRequests = await Request.findAll({ where: {userId: user.id, status: "approved", type: ["updateLicense", "replaceLicense"], paymentStatus: "unpaid" }});
  //   // console.log(approvedLicenseRequests);
  //   const returnData = await approvedLicenseRequests.map(async (request) => {
  //     if (request.licenseType === "driving") {
  //       const drivingLicense = await DrivingLicense.findOne({
  //         where: { id: request.licenseId },
  //       });
  //       if (drivingLicense) {
  //         request.licenseId = drivingLicense.licenseNumber;
  //       }
  //     }
  //   })
  //   console.log(returnData);
  //   return returnData;
  // },
  submitGrievance: async (user, payload, violationId) => {
    console.log(payload.grievanceDescription, violationId);
    if (!payload.grievanceDescription || !violationId) {
      throw new Error("Please provide a grievance description");
    }

    const violation = await TrafficViolation.findOne({
      where: { violationNumber: violationId },
    });
    if (!violation) {
      throw new Error("Violation not found");
    }
    violation.grievanceDescription = payload.grievanceDescription;
    violation.grievanceStatus = "pending";
    violation.grievanceDate = new Date().toISOString().split("T")[0];
    await violation.save();
    return violation;
  },
  uploadViolationPayment: async (user, paymentImage, violationNumbers) => {
    // console.log(paymentImage, violationNumbers);
    if (!violationNumbers || violationNumbers.length === 0) {
      throw new Error("At least one violation number is required");
    }

    const results = [];

    for (const violationNumber of violationNumbers) {
      const violation = await TrafficViolation.findOne({
        where: { violationNumber: violationNumber.trim() },
      });

      if (!violation) {
        results.push("No violation found");
        continue;
      }
      results.push(violation);
    }
    // Process the image upload (uncomment when ready)
    const resizedAvatar = await resizeAndCompressImage(
      paymentImage.buffer,
      100
    );
    const image = await Sirv.uploadImage(resizedAvatar);

    for (const violation of results) {
      violation.paymentImage = image;
      violation.status = "pending_approval";
      await violation.save();
    }
    return results;
  },

  // Process the image upload (uncomment when ready)
  // const resizedAvatar = await resizeAndCompressImage(paymentImage.buffer, 100);
  // const image = await Sirv.uploadImage(resizedAvatar);
  // violation.paymentImage = image;
  // await violation.save();

  //   return violation;
  // },
  // uploadViolationPayment: async (user, paymentImage, payload) => {
  //   console.log(paymentImage, payload);
  //   const violation = await TrafficViolation.findOne({
  //     where: { violationNumber: payload.violationNumber },
  //   });
  //   if (!violation) {
  //     throw new Error("Violation not found");
  //   }
  //   // const resizedAvatar = await resizeAndCompressImage(paymentImage.buffer, 100); // Resize to maximum dimensions of 200x200 with 60% quality
  //   // const image = await Sirv.uploadImage(resizedAvatar);
  //   // violation.paymentImage = image;
  //   // await violation.save();
  //   // return violation;
  // },
};

module.exports = userServices;
