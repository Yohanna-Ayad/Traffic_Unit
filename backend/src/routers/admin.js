const express = require("express");
// const userServices = require("../services/admin")
const auth = require("../middleware/auth");
const multer = require("multer");
const bodyParser = require('body-parser');
const router = new express.Router();
const adminController = require('../controllers/admin')

router.use(bodyParser.urlencoded({ extended: true }));

// //                            Admin

// const uploadNewsImage = multer({
//   limits: {
//     fileSize: 4000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
//       return cb(new Error("Please upload an Image file"));
//     }
//     cb(undefined, true);
//   },
// });
// router.post("/admin/news",uploadNewsImage.single("image"),auth ,adminController.addNews);

// //                    ADD Member
// router.post("/admin/members",auth,adminController.addMember);

// //                      Get Live Diagnostics
// router.get("/admin/live_diag", auth, adminController.getLiveDiag);

// //                     Mark Live Diagnostics as read
// router.patch("/admin/live_diag/:id", auth, adminController.markLiveDiag);

// //                      Delete Member
// router.delete("/admin/members", auth, adminController.deleteMember);

// //                    Get All Members
// router.get("/admin/members", auth, adminController.getAllMembers);

// //                    Get User By ID
// router.get("/admin/user/:id", auth, adminController.getUserById);

//     // Function to upload Hex Files
//     const uploadHexFile = multer({
//       limits: {
//         fileSize: 5000000,
//       },
//       fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(hex)$/)) {
//           cb(new Error("Please upload an Hex file"));
//         } else {
//           cb(null, true);
//         }
//       },
//       });


// router.post("/admin/upload", auth,  uploadHexFile.single("hex"), adminController.addUpdateFile);

// module.exports = router;