const express = require('express');
const { registerUser, verifyUser, loginUser, logoutUser, uploadAvatar, updateUserDetails, forgetPassword, verifyOtp, resetPassword, userDetails } = require('../controllers/user.controllers.js');
const auth = require('../middleware/auth.js');
const upload = require('../middleware/multer');  // Importing the multer module
const { getUserDetails} = require('../controllers/user.controllers.js')
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/verify-email', verifyUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', auth, logoutUser);
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar);
userRouter.put('/update-user', auth, updateUserDetails);
userRouter.put('/forget-password', forgetPassword);
userRouter.put('/verify-otp', verifyOtp);
userRouter.put('/reset-password', resetPassword);
userRouter.get('/user-details', auth, getUserDetails);

module.exports = userRouter;
