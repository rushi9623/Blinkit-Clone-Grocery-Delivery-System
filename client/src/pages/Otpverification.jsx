import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/SummaryApi";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // OTP state as an array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle OTP input changes
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      // Allow only single digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to the next input if not the last digit
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const otpCode = otp.join(""); // Combine OTP digits into a single string
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await Axios({
        ...summaryApi.forgot_password_otp_verification,
        data: { otp: otpCode }, // Only send OTP
      });
  
      alert("OTP verified successfully!");
  
      // Navigate to reset-password with state
      navigate("/reset-password", { state: { email: response.data.email } }); // Pass email or identifier
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <section className="w-full container mx-auto flex justify-center items-center py-12">
      <div className="bg-white my-4 shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          OTP Verification
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                maxLength={1}
                className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Didn't receive an OTP?{" "}
          <Link to="/forgot-password" className="text-blue-500 underline">
            Resend
          </Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;
        