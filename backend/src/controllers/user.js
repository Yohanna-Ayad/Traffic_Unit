const userServices = require("../services/user");
const mailer = require("../functions/nodemailer");

const userController = {
  // Function to create a new user          Done
  createUser: async (req, res) => {
    try {
      // console.log(req.body);
      // const result = await userServices.verifyCode(
      //   req.body.email,
      //   req.body.code
      // );
      // // console.log(result);
      // if (!result) {
      //   return res.status(400).send({ error: "Invalid verification code" });
      // }
      console.log(req.body.user);
      console.log(req.body.drivingLicense);
      
      const user = await userServices.createUser(req.body);
      if (
        user === "All fields are required!" ||
        user === "Password must be at least 8 characters!"
      ) {
        return res.status(400).send({ error: user });
      }
      if (user === "Email Already Exist" || user === "Phone already exists") {
        return res.status(409).send({ error: user });
      }
      if (user === "You must be 18 years or older to register") {
        return res.status(400).send({ error: user });
      }
      if (user === "National ID is expired") {
        return res.status(400).send({ error: user });
      }
      if (user === "National ID already exists") {
        return res.status(409).send({ error: user });
      }

      res.status(201).send({ message: "User created", user });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
  sendOTP: async (req, res) => {
    try {
      const user = await userServices.sendOTP(req.body.email);
      if (user === "Email not found") {
        return res.status(404).send({ error: user });
      }
      if (user === "User already exists") {
        return res.status(409).send({ error: user });
      }
      res.send({ message: "OTP sent successfully", user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const user = await userServices.forgotPassword(req.body.email);
      if (user === "Email not found") {
        return res.status(404).send({ error: user });
      }
      res.send({ message: "A reset code was sent to your account", user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const user = await userServices.resetPassword(
        req.body.email,
        req.body.code,
        req.body.password
      );
      if (user === "Invalid verification code") {
        return res.status(400).send({ error: user });
      }
      res.send({ message: "Password reset successful", user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  addLicense: async (req, res) => {
    try {
      const { license, user } = req.body;
      // Ensure both license and user data are provided
      if (!license || !user) {
        return res
          .status(400)
          .json({ message: "License and user data are required" });
      }
      const response = await userServices.addLicense(user, license);
      if (
        response === "All fields are required!" ||
        response === "Invalid dates" ||
        response === "License is expired"
      ) {
        return res.status(400).send({ error: response });
      }
      if (response === "User not found") {
        return res.status(404).send({ error: response });
      }
      if (response === "License already exists") {
        return res.status(409).send({ error: response });
      }
      res.send({ message: "License added successfully", response });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  addCar: async (req, res) => {
    try {
      const { car, user, carLicenseData } = req.body;
      // Ensure both car and user data are provided
      if (!car || !user || !carLicenseData) {
        return res.status(400).json({ message: "Car , user and car license data are required" });
      }
      const response = await userServices.addCar(user, car, carLicenseData);
      if (response === "All fields are required!" || response === "Invalid dates") {
        return res.status(400).send({ error: response });
      }
      if (response === "User not found") {
        return res.status(404).send({ error: response });
      }
      if (response === "Car already exists") {
        return res.status(409).send({ error: response });
      }
      res.send({ message: "Car added successfully", response });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to login a user       Done
  loginUser: async (req, res) => {
    try {
      const user = await userServices.loginUser(
        req.body.email,
        req.body.password
      );
      if (user === "Email and password are required!") {
        return res.status(400).send({ error: user });
      }
      res.send({ message: "Login successful", user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to verify a user account      Done
  // verifyUser: async (req, res) => {
  //   try {
  //     // console.log(req.user);
  //     const result = await mailer.verifyCode(req.user.email, req.body.code);
  //     if (!result) {
  //       return res.status(400).send({ error: "Invalid verification code" });
  //     }
  //     req.user.verified = true;
  //     await req.user.save();
  //     res.status(200).send({ message: "Verification successful" });
  //   } catch (error) {
  //     res.status(400).send(error.message);
  //   }
  // },
  // Function to logout a user       Done
  logoutUser: async (req, res) => {
    try {
      await userServices.logoutUser(req.user, req.token);
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  },
  // Function to logout all users       Done
  logoutAllUsers: async (req, res) => {
    try {
      await userServices.logoutAllUsers(req.user);
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  },
  // Function to get user profile       Done
  getProfile: async (req, res) => {
    const user = await userServices.getProfile(req.user);
    res.send(user);
  },
  // Function to update user profile       Done
  updateUser: async (req, res) => {
    try {
      var user = await userServices.updateUser(req.user, req.body);
      if (user === "Invalid updates!") {
        return res.status(400).send({ error: user });
      }
      if (user === "Phone already exists") {
        return res.status(409).send({ error: user });
      }
      res.send({ message: "User updated successful", user });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
  // Function to delete a user       Done
  deleteUser: async (req, res) => {
    try {
      await userServices.deleteUser(req.user);
      res.send({ message: "User deleted successful" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  // Function to get user cars       Done
  getUserCars: async (req, res) => {
    try {
      const userCars = await userServices.getUserCars(req.user);
      res.send(userCars);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to add car to user       Done
  addCarToUser: async (req, res) => {
    try {
      const user = await userServices.addCarToUser(req.user, req.body);
      res.send({ message: "Car added successfully", user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to remove car from user       Done
  removeCarFromUser: async (req, res) => {
    try {
      const user = await userServices.removeCarFromUser(req.user, req.body);
      res.send({ message: "Car removed successfully", user });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to upload avatar       Done
  uploadAvatar: async (req, res) => {
    const user = await userServices.uploadAvatar(req.user, req.file);
    res.send({ message: "Avatar uploaded", user: user });
  },
  replaceAvatar: async (req, res) => {
    // console.log(req.user.avatar)
    if (req.user.avatar) {
      console.log("user have avatar and wants to replace");
      const user = await userServices.replaceAvatar(req.user, req.file);
      if (user === "No image to replace with") {
        return res.status(400).send({ message: "No image to replace with" });
      }
      res.send({ message: "Avatar replaced", user: user });
    } else {
      console.log("user does not have avatar");
      const user = await userServices.uploadAvatar(req.user, req.file);
      res.send({ message: "Avatar uploaded", user: user });
    }
  },
  // Function to delete avatar       Done
  deleteAvatar: async (req, res) => {
    const result = await userServices.deleteAvatar(req.user);
    if (result === "No avatar to delete") {
      return res.status(404).send({ message: "No avatar to delete" });
    }
    res.send({ message: "Avatar deleted" });
  },
  // Function to get avatar       Done
  getAvatar: async (req, res) => {
    try {
      const avatar = await userServices.getAvatar(req.user.id);
      // res.set("Content-Type", "image/jpg");
      res.send(avatar);
    } catch (error) {
      res.status(404).send({ message: error.message });
    }
  },
  // Function to send diagnostics       Done
  sendDiagnostics: async (req, res) => {
    try {
      if (req.user.role !== "user") {
        return res.status(401).send({ error: "Unauthorized access" });
      }
      const diagnostics = await userServices.sendDiagnostics(
        req.body,
        req.user
      );
      if (
        diagnostics === "Car and diagnostics are required!" ||
        diagnostics === "Car not found"
      ) {
        return res.status(400).send({ error: diagnostics });
      }
      res.send({ message: "Your response sent successfully", diagnostics });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  //  Function to get News      Done
  getNews: async (req, res) => {
    try {
      const news = await userServices.getNews();
      res.send(news);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
};

module.exports = userController;
