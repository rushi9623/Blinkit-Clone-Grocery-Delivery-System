import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Otpverification from "../pages/Otpverification";
import ResetPassword from "../pages/ResetPassword";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "search",
                element : <SearchPage/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "register",
                element : <Register/>
            },
            {
                path : "forgotpassword",
                element : <ForgotPassword/>
            },
            {
                path : "verification-otp",
                element : <Otpverification/>
            },
            {
                path : "reset-password",
                element : <ResetPassword/>
            },
        ]
    }
])

export default router