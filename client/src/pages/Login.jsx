import React, { useState } from "react";
import { IoIosEyeOff } from "react-icons/io";
import { FaRegEye } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/SummaryApi";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      setError("Invalid email format!");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await Axios({
        ...summaryApi.login,
        data,
      });
      console.log("Response:", response.data);
      alert("Login successful!");

      setData({
        email: "",
        password: "",
      });
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <section className="w-full container mx-auto flex justify-center items-center py-12 ">
      <div className="bg-white my-4 shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          Welcome Back to Blinket
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to access your account
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid">
            <label htmlFor="email" className="text-sm font-semibold mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="bg-blue-50 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="grid">
            <label htmlFor="password" className="text-sm font-semibold mb-1">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                className="bg-blue-50 border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <IoIosEyeOff />}
              </div>
            </div>
            <Link to={'/forgotpassword'}className="block ml-auto hover:">Forgotpassword</Link>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
