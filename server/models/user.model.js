const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"]
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Provide Password"]
    },
    avatar: {
        type: String,
        default: null
    },
    mobile: {
        type: String,
        default: null
    },
    // refresh_token: {
    //     type: String,
    //     default: null  
    // },
    // verify_email: {
    //     type: Boolean,
    //     default: false  // Use Boolean for email verification status
    // },
    last_login_date: {
        type: Date,
        default: Date.now  // Default to current date/time
    },
    Status: {
        type: String,
        enum : ["Active","Inactive","Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'address'
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'cartProduct'  // Fixed typo
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'order'
        }
    ],
    forget_password_otp: {
        type: String,
        default: null
    },
    forget_password_expiry: {
        type: Date,
        default: null  // Default to null
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: "USER"
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
