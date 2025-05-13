const userServices = require("../services/user");
const mailer = require("../functions/nodemailer");
const { CloudHSM } = require("aws-sdk");

const userController = {
  // Function to create a new user          Done
  createUser: async (req, res) => {
    try {
      // console.log(req.body.user);
      // console.log(req.body.drivingLicense);
      // console.log(req.body.carLicense);

      const user = await userServices.createUser(req.body);
      if (
        user === "All fields are required!" ||
        user === "Password must be at least 8 characters!" ||
        user === "You must be 18 years or older to register" ||
        user === "National ID is expired" ||
        user === "National ID already exists" ||
        user === "Email Already Exist" ||
        user === "Phone already exists" ||
        user === "Invalid dates" ||
        user === "Driving license is expired" ||
        user === "Car not found" ||
        user === "Car already Linked to another user" ||
        user === "Car license is expired"
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
      res.status(201).send({ message: "User created", user });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
  checkUserData: async (req, res) => {
    try {
      const user = await userServices.checkUserData(req.body);
      if (
        user === "National ID already Exists" ||
        user === "Phone already Exists" ||
        user === "Email already Exists"
      ) {
        return res.status(409).send({ error: user });
      }
      res.status(200).send({ message: "User Not Exist" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
  checkCarExists: async (req, res) => {
    try {
      const user = await userServices.checkCarExists(req.body);
      if (user === "Car already exists") {
        return res.status(400).send({ error: "Car already exists" });
      }
      res.status(200).send({ message: "Car Not Exist" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
  checkLicenseExists: async (req, res) => {
    try {
      const user = await userServices.checkLicenseExists(req.body);
      if (user === "Driving license already exists") {
        return res
          .status(400)
          .send({ error: "Driving license already exists" });
      }
      res.status(200).send({ message: "License Not Exist" });
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
      // const { license } = req.body;
      // Ensure both license and user data are provided
      if (!req.body || !req.user) {
        return res
          .status(400)
          .json({ message: "License and user data are required" });
      }
      const response = await userServices.addLicense(req.user, req.body);
      if (
        response === "All fields are required!" ||
        response === "Invalid dates" ||
        response === "License is expired" ||
        response === "License already exists"
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
      console.log(req.body.carLicense);
      // const { car, user, carLicenseData } = req.body;
      // Ensure both car and user data are provided
      if (!req.body) {
        return res
          .status(400)
          .json({ message: "Car license data are required" });
      }
      const response = await userServices.addCar(req.user, req.body.carLicense);
      if (
        response === "All fields are required!" ||
        response === "Invalid dates" ||
        response === "Car license is expired"
      ) {
        return res.status(400).send({ error: response });
      }
      if (response === "User not found" || response === "Car not found") {
        return res.status(404).send({ error: response });
      }
      if (
        response === "Car already exists" ||
        response === "Car already Linked to another user"
      ) {
        return res.status(409).send({ error: response });
      }
      res.send({ message: "Car added successfully", response });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  addCarDataRequest: async (req, res) => {
    try {
      const user = req.user;
      const car = req.body;
      const response = await userServices.addCarDataRequest(user, car);
      if (response === "User not found" || response === "Car not found") {
        return res.status(404).send({ error: response });
      }
      res.send({ message: "Car Data Request sent successfully", response });

      // Send email to the user with the verification code
      // await mailer.sendVerificationEmail(req.user.email, req.user.verificationCode);
    } catch (error) {
      res.status(400).send({ error: error.message });
      // Log the error for debugging purposes
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
      const [userCars, carLicenses] = await userServices.getUserCars(req.user);
      if (userCars === "No cars found") {
        return res.status(404).send({ error: userCars });
      }
      res.send({ userCars, carLicenses });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getUserLicense: async (req, res) => {
    try {
      const license = await userServices.getUserLicense(req.user);
      if (license === "No driving license found") {
        return res.status(404).send({ error: license });
      }
      res.send(license);
    } catch (error) {
      if (error.message === "No driving license found") {
        return res.status(200).send({ message: error.message });
      }
      res.status(400).send({ error: error.message });
    }
  },
  removeCar: async (req, res) => {
    try {
      const user = await userServices.removeCar(req.user, req.body);
      res.send({ message: "Car removed successfully", user });
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
  requestDrivingLicenseCourse: async (req, res) => {
    try {
      const request = await userServices.requestDrivingLicenseCourse(req.user);
      if (
        request ===
        "You already have a pending request for a driving license course"
      ) {
        return res.status(400).send({ message: request });
      }
      res.send({ message: "Request sent successfully", request });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  checkDrivingLicenseCourseRequest: async (req, res) => {
    try {
      const request = await userServices.checkDrivingLicenseCourseRequest(
        req.user
      );
      if (request === true) {
        return res.send({ request });
      }
      res.send({ message: "Request found", request });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getUserNotifications: async (req, res) => {
    try {
      const notifications = await userServices.getUserNotifications(req.user);
      if (notifications === "No notifications found") {
        return res.status(404).send({ error: notifications });
      }
      res.send(notifications);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  markUserNotifications: async (req, res) => {
    try {
      const notifications = await userServices.markUserNotifications(
        req.user,
        req.params.id
      );
      if (notifications === "No notification found") {
        return res.status(404).send({ error: notifications });
      }
      res.send({ message: "Notification marked successfully", notifications });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  markAllNotificationsAsRead: async (req, res) => {
    try {
      const updated = await userServices.markAllNotificationsAsRead(req.user);
      res.send({ message: "All notifications marked as read", count: updated });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  clearAllNotifications: async (req, res) => {
    try {
      await userServices.clearAllNotifications(req.user);
      res.status(204).send(); // No content
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  deleteUserNotification: async (req, res) => {
    try {
      const notification = await userServices.deleteUserNotification(
        req.user,
        req.params.id || req.body.id
      );
      if (notification === "No notification found") {
        return res.status(404).send({ error: notification });
      }
      res.send({ message: "Notification deleted successfully", notification });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  checkCourseApproval: async (req, res) => {
    try {
      const approved = await userServices.checkCourseApproval(req.user);
      if (approved === "No course found") {
        return res.status(404).send({ error: approved });
      }
      res.send({ message: "Course approval status", approved });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  requestDrivingLicenseExam: async (req, res) => {
    try {
      const request = await userServices.requestDrivingLicenseExam(req.user);
      if (
        request ===
        "You already have a pending request for a driving license exam"
      ) {
        return res.status(400).send({ message: request });
      }
      res.send({ message: "Request sent successfully", request });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  checkDrivingLicenseExamRequest: async (req, res) => {
    try {
      const request = await userServices.checkDrivingLicenseExamRequest(
        req.user
      );
      if (request === true) {
        return res.send({ request });
      }
      res.send({ message: "Request found", request });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  checkDrivingLicenseExamApproval: async (req, res) => {
    try {
      const approved = await userServices.checkDrivingLicenseExamApproval(
        req.user
      );
      if (approved === "No exam found") {
        return res.status(404).send({ error: approved });
      }
      res.send({ message: "Exam approval status", approved });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getDrivingLicenseExamQuestions: async (req, res) => {
    try {
      const questions = await userServices.getDrivingLicenseExamQuestions(
        req.user
      );
      if (questions === "No questions found") {
        return res.status(404).send({ error: questions });
      }
      res.send({ message: "Questions retrieved successfully", questions });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  requestPracticalDrivingLicenseExam: async (req, res) => {
    try {
      const request = await userServices.requestPracticalDrivingLicenseExam(
        req.user,
        req.body
      );

      if (
        request ===
          "You already have a pending request for a practical driving license exam" ||
        request ===
          "You must pass the theoretical exam before requesting the practical exam"
      ) {
        return res.status(400).send({ message: request });
      }

      res.status(200).send({ message: "Request sent successfully", request });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  checkPracticalDrivingLicenseExamRequest: async (req, res) => {
    try {
      const request =
        await userServices.checkPracticalDrivingLicenseExamRequest(req.user);
      if (request.approved === true) {
        return res.send({ request });
      }
      res.send({ request });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  choosePracticalDrivingLicenseExamDate: async (req, res) => {
    try {
      const request = await userServices.choosePracticalDrivingLicenseExamDate(
        req.user,
        req.body
      );
      if (request === "No request found") {
        return res.status(404).send({ error: request });
      }
      res.send({ message: "Exam date chosen successfully", request });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  checkCoursePermission: async (req, res) => {
    try {
      const permission = await userServices.checkCoursePermission(req.user);
      if (permission === "No course found") {
        return res.status(404).send({ error: permission });
      }
      res.send({ message: "Course permission status", permission });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  checkExamPermission: async (req, res) => {
    try {
      const permission = await userServices.checkExamPermission(req.user);
      if (permission === "No exam found") {
        return res.status(404).send({ error: permission });
      }
      res.send({ message: "Exam permission status", permission });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  reRequestDrivingLicenseTheoreticalExam: async (req, res) => {
    try {
      const request = await userServices.reRequestDrivingLicenseTheoreticalExam(
        req.user
      );
      if (request === "No request found") {
        return res.status(404).send({ error: request });
      }
      res.send({ message: "Re-request sent successfully", request });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  check30DaysPassedSinceLastExam: async (req, res) => {
    try {
      const passed = await userServices.check30DaysPassedSinceLastExam(
        req.user
      );
      if (passed === "No exam found") {
        return res.status(404).send({ error: passed });
      }
      res.send({ message: "30 days check status", passed });
    } catch (error) {
      if (error.message === "No failed request found") {
        return res.status(200).send({ message: error.message });
      }
      res.status(400).send({ error: error.message });
    }
  },
  getUserViolations: async (req, res) => {
    try {
      const violations = await userServices.getUserViolations(req.user);
      if (violations === "No violations found") {
        return res.status(404).send({ error: violations });
      }
      res.send({ message: "Violations retrieved successfully", violations });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  submitGrievance: async (req, res) => {
    try {
      const grievance = await userServices.submitGrievance(
        req.user,
        req.body,
        req.params.id
      );
      if (grievance === "No violation found") {
        return res.status(404).send({ error: grievance });
      }
      res.send({ message: "Grievance submitted successfully", grievance });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  uploadViolationPayment: async (req, res) => {
    try {
      if (!req.file) {
        throw new Error("Payment image is required");
      }

      // Get violation numbers from the form data (comma-separated)
      const violationNumbers = req.body.violationNumbers.split(",");

      const results = await userServices.uploadViolationPayment(
        req.user,
        req.file,
        violationNumbers
      );

      if (results.some((result) => result === "No violation found")) {
        return res
          .status(404)
          .send({ error: "Some violations were not found" });
      }

      res.send({
        message: "Payment uploaded successfully for all violations",
        results,
      });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  //  uploadViolationPayment: async (req, res) => {
  //     try {
  //       const payment = await userServices.uploadViolationPayment(
  //         req.user,
  //         req.file,
  //         req.body
  //       );
  //       if (payment === "No violation found") {
  //         return res.status(404).send({ error: payment });
  //       }
  //       res.send({ message: "Payment uploaded successfully", payment });
  //     } catch (error) {
  //       res.status(400).send({ error: error.message });
  //     }
  //   },
  // requestPracticalDrivingLicenseExam: async (req, res) => {
  //   try {
  //     const request = await userServices.requestPracticalDrivingLicenseExam(req.user, req.body);
  //     if (request === "You already have a pending request for a practical driving license exam" || request === "You must pass the theoretical exam before requesting the practical exam") {
  //       console.log(request);
  //       return res.status(400).send({ message: request });
  //     }
  //     res.send({ message: "Request sent successfully", request });
  //   } catch (error) {
  //     res.status(400).send({ error: error.message });
  //   }
  // },
};

module.exports = userController;
