export const baseURL = "http://localhost:8080"

const summaryApi = {
    register: {
        url: '/api/users/register', // Changed to 'users'
        method: 'post'
    },
    login : {
        url :  '/api/users/login',
        method : 'post'
    },
    forgot_password : {
        url : '/api/users/forget-password',
        method : 'put'
    },
    forgot_password_otp_verification : {
        url : '/api/users/verify-otp',
        method :'put'
    },
    resetPassword : {
        url : 'api/users/reset-password',
        method : 'put'
    }

};


export default summaryApi