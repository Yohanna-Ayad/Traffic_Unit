const express = require("express");
// const userServices = require("../services/admin")
const auth = require("../middleware/auth");
const multer = require("multer");
const bodyParser = require('body-parser');
const router = new express.Router();
const adminController = require('../controllers/admin')

router.use(bodyParser.urlencoded({ extended: true }));

// //                            Admin

//                    Create Admin           
router.post('/admin/createAdmin', auth,adminController.createAdmin)

//                    Get All Admins
router.get('/admin/getAllAdmins', auth,adminController.getAllAdmins)

//                    Edit Admin
router.patch('/admin/editAdmin', auth,adminController.editAdmin)

//                    Delete Admin
router.delete('/admin/deleteAdmin/:id', auth,adminController.deleteAdmin)

//                    Get All Driving Licenses
router.get('/admin/getAllDrivingLicenses', auth,adminController.getAllDrivingLicenses)

//                    Need to fix the Create user in the user router
//                    Add Driving License
router.post('/admin/addDrivingLicense', auth,adminController.addDrivingLicense)

//                    Get All Car Licenses
router.get('/admin/getAllCarLicenses', auth,adminController.getAllCarLicenses)

//                    Edit Driving License
router.patch('/admin/updateDrivingLicense/:id', auth,adminController.editDrivingLicense)

//                    Delete Driving License
router.delete('/admin/deleteDrivingLicense/:id', auth,adminController.deleteDrivingLicense)

//                    Add Car License
router.post('/admin/addCarLicense', auth,adminController.addCarLicense)



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

module.exports = router;