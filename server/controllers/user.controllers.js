const UserModel = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../config/sendEmail.js');
const verifyEmailTemplate = require('../utils/verifyEmailTemplate.js');
const otpTemplate = require ('../utils/verifyEmailTemplate.js') // Template for OTP email
const uploadImageCloudinary = require('../utils/uploadimageCloudinary.js');
const upload = require('../middleware/multer.js');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, mobile, avatar } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            mobile,
            avatar: null,
        });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { code } = req.body;

        const user = await UserModel.findOne({ _id: code });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification code.", error: true });
        }

        await UserModel.updateOne({ _id: code }, { verify_email: true });
        res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error verifying email.", error });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User is not registered" });
        }

        if (user.Status !== 'Active') {
            return res.status(401).json({ message: "Contact admin, user is inactive or suspended" });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const accessToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                mobile: user.mobile,
                last_login_date: user.last_login_date,
                shopping_cart: user.shopping_cart,
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in", error: error.message || error });
    }
};

const logoutUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);

        if (user) {
            user.refresh_token = null;
            await user.save();
        }

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User ID is missing in the request" });
        }

        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ message: "No file provided for upload" });
        }

        const image = req.file;
        const result = await uploadImageCloudinary(image.buffer);

        if (!result || !result.secure_url) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { avatar: result.secure_url },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found in the database" });
        }

        res.status(200).json({ message: "Avatar uploaded successfully", user: updatedUser });
    } catch (err) {
        console.error("Error in uploadAvatar:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, password, mobile } = req.body;

        if (!name && !email && !password && !mobile) {
            return res.status(400).json({ message: "No data provided to update" });
        }

        let updatePassword;
        if (password) {
            updatePassword = await bcrypt.hash(password, 10);
        }

        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (updatePassword) updateFields.password = updatePassword;
        if (mobile) updateFields.mobile = mobile;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User details updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Forget Password
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        user.forget_password_otp = otp; // Save OTP to user's record
        user.forget_password_expiry = Date.now() + 3600000; // Set expiry to 1 hour
        await user.save();

        // Send OTP via email
        await sendEmail({
            sendTo: email,
            subject: "Password Reset OTP",
            html: `
                <p>Dear User,</p>
                <p>Your OTP for resetting your password is:</p>
                <h3>${otp}</h3>
                <p>This OTP is valid for 1 hour. Please do not share it with anyone.</p>
            `,
        });

        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        console.error("Error in forgetPassword:", error);
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
};



// Verify OTP
const verifyOtp = async (req, res) => {
    try {
      const { otp } = req.body; // Only expect OTP
  
      const user = await UserModel.findOne({
        forget_password_otp: otp,
        forget_password_expiry: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
  
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
  };
  
  

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await UserModel.findOne({ email, forget_password_otp: otp, forget_password_expiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.forget_password_otp = null;
        user.forget_password_expiry = null;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

// get login user details 

const getUserDetails = async (req, res) => {
    try {
        // `req.user` should be populated by the auth middleware
        const userId = req.user._id;

        // Fetch user details excluding sensitive data like password
        const user = await UserModel.findById(userId).select('-password -forget_password_otp -forget_password_expiry');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user,
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Error fetching user details", error: error.message });
    }
};



module.exports = { 
    uploadAvatar, 
    registerUser, 
    verifyUser, 
    loginUser, 
    logoutUser, 
    updateUserDetails, 
    forgetPassword, 
    verifyOtp, 
    resetPassword,
    getUserDetails,

};
