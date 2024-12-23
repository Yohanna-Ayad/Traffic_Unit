const mailer = require("../functions/nodemailer");
// const User = require("../models/user");
// const Car = require("../models/car");
const bcrypt = require("bcryptjs");
const utilities = require("../functions/utils");
const Sirv = require("../functions/Sirv");
const sharp = require("sharp");

const User = require("../schemas/user");
const Car = require("../schemas/car");
const License = require("../schemas/drivingLicense");
const CarLicense = require("../schemas/carLicense");
const tableCreation = require("../schemas/tableCreation");

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
  console.log(nationalIdEndDate);
  const date = new Date();
  const nationalIdEndDate2 = new Date(nationalIdEndDate);
  console.log(date);
  console.log(nationalIdEndDate2);
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
      !payload.licenseType
    ) {
      return "All fields are required!";
    }
    if (
      await License.findOne({ where: { licenseNumber: payload.licenseNumber } })
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

    const license = await License.create({
      licenseNumber: payload.licenseNumber,
      startDate: payload.startDate,
      endDate: payload.endDate,
      licenseType: payload.licenseType,
      userName: user.name,
      nationalId: user.nationalId,
      userId: userExists.id,
    });
    await license.save();
    return user;
  },
  addCar: async (user, carPayload, carLicenseData) => {
    if (!carPayload.maker || !carPayload.model || !carPayload.year || !carPayload.bodyType || !carPayload.engineType || !carPayload.engineCylinders || !carPayload.engineSize || !carLicenseData.plateNumber || !carLicenseData.startDate || !carLicenseData.endDate || !carLicenseData.licenseType || !carLicenseData.motorNumber || !carLicenseData.chassisNumber || !carLicenseData.carColor || !carLicenseData.checkDate || !carLicenseData.trafficUnit) {
      return "All fields are required!";
    }
    const car = await Car.findOne({
      where: {
        maker: carPayload.maker,
        model: carPayload.model,
        year: carPayload.year,
        engineType: carPayload.engineType,
        engineCylinders: carPayload.engineCylinders,
        engineSize: carPayload.engineSize,
        bodyType: carPayload.bodyType,
      },
    });
    if (!car) {
      return "Car not found";
    }
    const existCarLicense = await CarLicense.findOne({
      where: { carId: car.id },
    });
    if (existCarLicense) {
      return "Car already exists";
    }
    const carLicense = await CarLicense.create({
      carId: car.id,
      userId: user.id,
      plateNumber: carLicenseData.plateNumber,
      startDate: carLicenseData.startDate,
      endDate: carLicenseData.endDate,
      // licenseType: carLicenseData.licenseType,
      petrolType: car.engineType,
      motorNumber: carLicenseData.motorNumber,
      chassisNumber: carLicenseData.chassisNumber,
      carColor: carLicenseData.carColor,
      checkDate: carLicenseData.checkDate,
      trafficUnit: carLicenseData.trafficUnit,
    });
      

    // const userCars = await user.getCars();
    // userCars.forEach((c) => {
    //   if (c.id === car.id) {
    //     return "Car already exists in user's list";
    //   }
    // });
    // await user.addCar(car);
    // return user;
  },
  verifyCode: async (email, code) => {
    const result = await mailer.verifyCode(email, code);
    return result;
  },
  createUser: async (payload) => {
    const calculateDOB = payload.nationalId.substring(1, 7);
    const year = calculateDOB.substring(0, 2);
    const month = calculateDOB.substring(2, 4);
    const day = calculateDOB.substring(4, 6);
    const dob = new Date(`20${year}-${month}-${day}`);
    const age = new Date().getFullYear() - dob.getFullYear();
    console.log(dob);
    console.log(age);
    if (age < 18) {
      return "You must be 18 years or older to register";
    }

    const validationError = await signupProcess({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      nationalId: payload.nationalId,
      gender: payload.gender,
      nationality: payload.nationality,
      address: payload.address,
      government: payload.government,
      nationalIdStartDate: payload.nationalIdStartDate,
      nationalIdEndDate: payload.nationalIdEndDate,
      birthDate: dob,
    });
    if (validationError) {
      return validationError;
    }
    payload.password = await utilities.hashPassword(payload.password);
    payload.verified = true;
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      nationalId: payload.nationalId,
      gender: payload.gender,
      nationality: payload.nationality,
      address: payload.address,
      government: payload.government,
      nationalIdStartDate: payload.nationalIdStartDate,
      nationalIdEndDate: payload.nationalIdEndDate,
      birthDate: dob,
    });

    await user.save();

    // await mailer.handleSignup(user.email);

    const returnData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      verified: user.verified,
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
      verified: user.verified,
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
    user.verified = true;
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
    const allowedUpdates = ["name", "password", "phone"];
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
    const userCars = await user.getCars();
    Cars = userCars.map((car) => {
      return {
        maker: car.maker,
        model: car.model,
        year: car.year,
      };
    });
    return Cars;
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
