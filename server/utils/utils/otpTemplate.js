module.exports = (otp) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Password Reset OTP</h2>
            <p>Your OTP for password reset is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 1 hour.</p>
        </div>
    `;
};
