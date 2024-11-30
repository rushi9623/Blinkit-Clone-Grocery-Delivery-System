const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

async function connectDB() {
    try {
        await mongoose.connect  (process.env.MONGODB_URL);
               console.log("Connected to Database")
    } catch(error){
        console.error("Failed To Connect",error)
        process.exit(1)
    }
}

module.exports = connectDB