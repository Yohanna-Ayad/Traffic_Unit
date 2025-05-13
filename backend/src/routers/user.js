const express = require("express");

const auth = require("../middleware/auth");
const multer = require("multer");
const bodyParser = require("body-parser");

const router = new express.Router();
const userController = require("../controllers/user");

router.use(bodyParser.urlencoded({ extended: true }));

//              Sign Up       Done
router.post("/users", userController.createUser);

//              Login         Done

router.post("/users/login", userController.loginUser);

//              Check User data
router.post("/users/checkSignup", userController.checkUserData);

//              Check if car exists

router.post("/users/carExists", userController.checkCarExists);

//              Check if Driving License exists

router.post("/users/licenseExists", userController.checkLicenseExists);

//              Send OTP     Done
// router.post("/users/otp",userController.sendOTP);

//  Forgot Password
router.post("/users/forgot", userController.forgotPassword);

//              Reset Password
router.post("/users/reset", userController.resetPassword);

//             Add Driving License     Done
router.post("/users/me/license", auth, userController.addLicense);

//             Add Car License      Done
router.post("/users/me/car", auth, userController.addCar);

//            Add New Car Data request

router.post("/users/me/car/request", auth, userController.addCarDataRequest);

//             Account Verification
// router.post("/users/me/verify",auth,userController.verifyUser);

//              Log Out for one User      Done
router.post("/users/logout", auth, userController.logoutUser);

//              Logout For All Users (Tokens)     Done
router.post("/users/logoutAll", auth, userController.logoutAllUsers);

//              Get Profile     Done

router.get("/users/me", auth, userController.getProfile);

//              Update User     Done

router.patch("/users/me", auth, userController.updateUser);

//  Delete User     Done

router.delete("/users/me", auth, userController.deleteUser);

// Get User Owned Cars      Done
router.get("/users/me/cars", auth, userController.getUserCars);

//          Get User Owned Driving License     Done
router.get("/users/me/Drlicense", auth, userController.getUserLicense);

//          Remove Car and Car License from User Done
router.delete("/users/me/cars", auth, userController.removeCar);

//          Request Driving License Course Done
router.post(
  "/users/me/request/drivingLicense",
  auth,
  userController.requestDrivingLicenseCourse
);

//          Check if Driving License Course is requested Done
router.get(
  "/users/me/request/drivingLicense",
  auth,
  userController.checkDrivingLicenseCourseRequest
);

//          Get User Notifications Done
router.get(
  "/users/me/notifications",
  auth,
  userController.getUserNotifications
);

//          Mark User Notifications Done
router.patch(
  "/users/me/notifications/:id",
  auth,
  userController.markUserNotifications
);

//          Mark All User Notifications Done
router.patch(
  "/users/me/notifications",
  auth,
  userController.markAllNotificationsAsRead
);

//          Clear User Notifications Done
router.delete(
  "/users/me/notifications",
  auth,
  userController.clearAllNotifications
);

//          Delete User Notification Done
router.delete(
  "/users/me/notifications/:id",
  auth,
  userController.deleteUserNotification
);

//          Check if User is Course Approved Done
router.get(
  "/users/me/course/approved",
  auth,
  userController.checkCourseApproval
);

//          Request Driving License Exam Done
router.post(
  "/users/me/request/drivingLicenseExam",
  auth,
  userController.requestDrivingLicenseExam
);

//          Check if Driving License Exam is requested Done
router.get(
  "/users/me/request/drivingLicenseExam",
  auth,
  userController.checkDrivingLicenseExamRequest
);

//          check if Driving License Exam is approved Done
router.get(
  "/users/me/drivingLicenseExam/approved",
  auth,
  userController.checkDrivingLicenseExamApproval
);

//         Get 20 Questions for Driving License Exam Done
router.get(
  "/users/me/drivingLicenseExam/questions",
  auth,
  userController.getDrivingLicenseExamQuestions
);

//         Request Practical Driving License Exam Done
router.post(
  "/users/me/request/practicalDrivingLicenseExam",
  auth,
  userController.requestPracticalDrivingLicenseExam
);

//        Check if Practical Driving License Exam is requested Done
router.get(
  "/users/me/request/practicalDrivingLicenseExam",
  auth,
  userController.checkPracticalDrivingLicenseExamRequest
);

// //         Choose Practical Driving License Exam Date Done
// router.post("/users/me/request/practicalDrivingLicenseExam/date", auth, userController.choosePracticalDrivingLicenseExamDate);

//        Check if User have Permission to take the course Done
router.get(
  "/users/me/course/permission",
  auth,
  userController.checkCoursePermission
);

//        Check if User have Permission to take the exam Done
router.get(
  "/users/me/exam/permission",
  auth,
  userController.checkExamPermission
);

//        Re-Request Driving License Exam Done
router.post(
  "/users/me/request/drivingLicenseExam/reRequest",
  auth,
  userController.reRequestDrivingLicenseTheoreticalExam
);

//        Check if 30 days passed since last theoretical exam Done
router.get(
  "/users/me/request/drivingLicenseExam/30days",
  auth,
  userController.check30DaysPassedSinceLastExam
);

//        Get All User Violations Done
router.get("/users/me/violations", auth, userController.getUserViolations);

//        Submit Grievance for Traffic Violation Done
router.post(
  "/users/me/violations/grievance/:id",
  auth,
  userController.submitGrievance
);

const uploadViolationPaymentImage = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an Image file"));
    }
    cb(undefined, true);
  },
});
// routes/user.js
router.post(
  "/users/me/violations/payment",
  auth,
  uploadViolationPaymentImage.single("payment"),
  userController.uploadViolationPayment,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
// //        Upload Violation Payment Done
// router.post("/users/me/violations/payment", auth, uploadViolationPaymentImage.single("payment"), userController.uploadViolationPayment,
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

const uploadImage = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an Image file"));
    }
    cb(undefined, true);
  },
});
//        upload user profile image     Done
router.post(
  "/users/me/avatar",
  auth,
  uploadImage.single("avatar"),
  userController.uploadAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//      replace user profile image     Done
router.patch(
  "/users/me/avatar",
  auth,
  uploadImage.single("avatar"),
  userController.replaceAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//       Delete user profile image     Done
router.delete("/users/me/avatar", auth, userController.deleteAvatar);

//      Get user profile image     Done
router.get("/users/avatar", auth, userController.getAvatar);

// router.get("/users/news",auth,userController.getNews);

// Error handling middleware
router.use((error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

module.exports = router;
