const express = require("express");

const auth = require("../middleware/auth");
const multer = require("multer");
const bodyParser = require('body-parser');

const router = new express.Router();
const userController = require("../controllers/user");

router.use(bodyParser.urlencoded({ extended: true }));

//              Sign Up       Done              
router.post("/users",userController.createUser);

//              Login

router.post("/users/login",userController.loginUser);

//              Send OTP     Done 
// router.post("/users/otp",userController.sendOTP);

//              Forgot Password
router.post("/users/forgot",userController.forgotPassword);

//              Reset Password
router.post("/users/reset",userController.resetPassword);

//             Add Driving License     Done 
router.post("/users/me/license",userController.addLicense);

//             Add Car License
router.post("/users/me/car",userController.addCar);


//             Account Verification
// router.post("/users/me/verify",auth,userController.verifyUser);

//              Log Out for one User
router.post("/users/logout", auth, userController.logoutUser);

//              Logout For All Users (Tokens)
router.post("/users/logoutAll", auth, userController.logoutAllUsers);

//              Get Profile

router.get("/users/me", auth, userController.getProfile);

//              Update User

router.patch("/users/me", auth, userController.updateUser);

//              Delete User

// router.delete("/users/me", auth, userController.deleteUser);

//           Get User Owned Cars
// router.get("/users/me/cars", auth, userController.getUserCars);

//           Add car to user
// router.post("/users/me/cars", auth, userController.addCarToUser);

//        remove car from user
// router.delete("/users/me/cars", auth, userController.removeCarFromUser);

//        user diagnostics
// router.post("/users/me/diagnostic", auth, userController.sendDiagnostics);

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

router.post("/users/me/avatar",auth,uploadImage.single("avatar"),userController.uploadAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.patch("/users/me/avatar", auth, uploadImage.single("avatar"), userController.replaceAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, userController.deleteAvatar);

router.get("/users/avatar",auth, userController.getAvatar);

router.get("/users/news",auth,userController.getNews);


// Error handling middleware
router.use((error, req, res, next) => {
  res.status(400).send({ error: error.message });
});


module.exports = router;
