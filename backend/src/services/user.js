const mailer = require("../functions/nodemailer");
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
const Vehicle = require("../schemas/car");

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
    if (startDate > endDate) {
      return "Invalid dates";
    }
    if (endDate < new Date()) {
      return "License is expired";
    }
    // Check if user exists
    const userExists = await User.findOne({
      where: { nationalId: user.nationalId },
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
      userId: userExists.nationalId,
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
        userId: user.nationalId,
        vehicleId: car.id,
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
    const dob = new Date(`20${year}-${month}-${day}`);
    const age = new Date().getFullYear() - dob.getFullYear();
    // console.log(dob);
    // console.log(age);
    if (age < 18) {
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
    payload.password = await utilities.hashPassword(payload.user.password);
    // payload.verified = true;
    const user = await User.create({
      name: payload.user.name,
      email: payload.user.email,
      password: utilities.hashPassword(payload.user.password, 10),
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
      const startDate = new Date(payload.drivingLicense.startDate);
      const endDate = new Date(payload.drivingLicense.endDate);
      if (startDate > endDate) {
        return "Invalid dates";
      }
      if (endDate < new Date()) {
        return "Driving license is expired";
      }
      try {
        const drivingLicense = await DrivingLicense.create({
          userName: user.name,
          nationalId: user.nationalId,
          userId: user.nationalId,
          licenseNumber: payload.drivingLicense.licenseNumber,
          licenseType: payload.drivingLicense.licenseType,
          trafficUnit: payload.drivingLicense.trafficUnit,
          startDate: startDate,
          endDate: endDate,
        });
        await drivingLicense.save();
      } catch (error) {
        console.log(error);
      }
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
        where: { plateNumber: payload.carLicense.carPlateNumber },
      });
      if (existCarLicense) {
        return "Car already Linked to another user";
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

      try {
        const carLicense = await CarLicense.create({
          userId: user.nationalId,
          vehicleId: car.id,
          plateNumber: payload.carLicense.carPlateNumber,
          startDate: carStartDate,
          endDate: carEndDate,
          licenseType: payload.carLicense.licenseType,
          motorNumber: payload.carLicense.engineNumber,
          chassisNumber: payload.carLicense.chassisNumber,
          carColor: payload.carLicense.color,
          checkDate: carCheckDate,
          trafficUnit: payload.carLicense.trafficUnit,
        });
        await carLicense.save();
      } catch (error) {
        console.log(error);
      }
    }
    // await mailer.handleSignup(user.email);
    const returnData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      tokens: user.tokens,
    };
    return { user: returnData };
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
      name: user.name,
      email: user.email,
      // verified: user.verified,
      role: user.role,
      tokens: user.tokens,
    };
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
    const allowedUpdates = ["name", "password", "phone","address"];
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
      where: { userId: user.nationalId },
    });
    if (!carLicenses) {
      throw new Error("No cars found");
    }
    const userCars = [];
    for (let i = 0; i < carLicenses.length; i++) {
      const car = await Car.findByPk(carLicenses[i].vehicleId);
      userCars.push(car);
    }
    return [userCars,carLicenses];
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
      if (c.id === userCar.id) {
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
    const resizedAvatar = await resizeAndCompressImage(avatar.buffer, 100); // Resize to maximum dimensions of 200x200 with 60% quality
    const image = await Sirv.uploadImage(resizedAvatar); // Upload the resized and compressed image to Sirv
    user.avatar = image;
    await user.save();
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
  getNews: async () => {
    const latestNews = await News.findOne({
      order: [["createdAt", "DESC"]], // Assuming 'createdAt' is the timestamp field for news
    });
    return latestNews;
  },
};

module.exports = userServices;
