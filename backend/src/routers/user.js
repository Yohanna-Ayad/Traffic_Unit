const express = require("express");

const auth = require("../middleware/auth");
const multer = require("multer");
const bodyParser = require('body-parser');

const router = new express.Router();
const userController = require("../controllers/user");

router.use(bodyParser.urlencoded({ extended: true }));

//              Sign Up       Done              
router.post("/users",userController.createUser);

//              Login         Done

router.post("/users/login",userController.loginUser);

//              Check User data
router.post("/users/checkSignup", userController.checkUserData);

//              Check if car exists

router.post("/users/carExists", userController.checkCarExists);

//              Check if Driving License exists

router.post("/users/licenseExists", userController.checkLicenseExists);

//              Send OTP     Done 
// router.post("/users/otp",userController.sendOTP);

            //  Forgot Password
router.post("/users/forgot",userController.forgotPassword);

//              Reset Password
router.post("/users/reset",userController.resetPassword);

//             Add Driving License     Done 
router.post("/users/me/license", auth ,userController.addLicense);

//             Add Car License      Done
router.post("/users/me/car", auth ,userController.addCar);

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
router.post("/users/me/request", auth, userController.requestDrivingLicenseCourse);

//          Check if Driving License Course is requested Done
router.get("/users/me/request", auth, userController.checkDrivingLicenseCourseRequest);

//          Get User Notifications Done
router.get("/users/me/notifications", auth, userController.getUserNotifications);


////////////////////          STILL NEED TO FIX THIS        ///////////////////////////
//          Mark User Notifications Done
router.patch("/users/me/notifications", auth, userController.markUserNotifications);




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
router.post("/users/me/avatar",auth,uploadImage.single("avatar"),userController.uploadAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//      replace user profile image     Done
router.patch("/users/me/avatar", auth, uploadImage.single("avatar"), userController.replaceAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//       Delete user profile image     Done
router.delete("/users/me/avatar", auth, userController.deleteAvatar);

//      Get user profile image     Done 
router.get("/users/avatar",auth, userController.getAvatar);


// router.get("/users/news",auth,userController.getNews);


// Error handling middleware
router.use((error, req, res, next) => {
  res.status(400).send({ error: error.message });
});


module.exports = router;
