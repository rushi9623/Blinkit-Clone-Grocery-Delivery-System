const otpTemplate = (otp) => {
    return `
        <p>Dear User,</p>
        <p>Your OTP for resetting your password is:</p>
        <h3>${otp}</h3>
        <p>This OTP is valid for 1 hour. Please do not share it with anyone.</p>
    `;
};

module.exports = otpTemplate;
