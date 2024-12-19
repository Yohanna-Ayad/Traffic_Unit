const mailer = require("../functions/nodemailer");
// const User = require("../models/user");
// const Car = require("../models/car");
const bcrypt = require("bcryptjs");
const utilities = require("../functions/utils");
const Sirv = require("../functions/Sirv");
const sharp = require("sharp");

const User = require("../schemas/user");
const Car = require("../schemas/car");

const tableCreation = require("../schemas/tableCreation");

const signupProcess = async ({ name, email, password, phone }) => {
  if (!name || !email || !password || !phone) {
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
  verifyCode: async (email, code) => {
    const result = await mailer.verifyCode(email, code);
    return result;
  },
  createUser: async (payload) => {
    const validationError = await signupProcess({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
    });
    if (validationError) {
      return validationError;
    }
    payload.password = await utilities.hashPassword(payload.password);
    payload.verified = true;
    const user = await User.create(payload);
    const car = await Car.findOne({
      where: {
        model: payload.model,
        maker: payload.maker,
        year: payload.year,
      },
    });
    if (!car) {
      throw new Error("Car not found");
    }
    await user.addCar(car);
    await user.save();

    // await mailer.handleSignup(user.email);

    const returnData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      verified: user.verified,
      tokens: user.tokens,
      car: {
        maker: car.maker,
        model: car.model,
        year: car.year,
      },
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
    const permissions = await user.getPermissions();
    const plainPermissions = permissions.map(
      (permission) => permission.get({ plain: true }).id
    );
    const token = await utilities.generateToken(user, plainPermissions);
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
