const mongoose = require('mongoose')
const config = require('./config')
const mongoURL = config.MONGO_URL
const dbConnection = async()=>{
    try {
       await mongoose.connect(mongoURL)
       console.log("database connected successfully")
    } catch (error) {
        console.log(" MongoDb Connection Error : ",error)
    }
}

module.exports = dbConnection