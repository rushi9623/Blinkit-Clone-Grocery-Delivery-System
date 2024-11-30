import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/SummaryApi";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // Get email from state

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await Axios({
        ...summaryApi.reset_password, // Define your API endpoint in SummaryApi
        data: { email, password },
      });

      alert("Password reset successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full container mx-auto flex justify-center items-center py-12">
      <div className="bg-white my-4 shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          Reset Password
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your new password below.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
