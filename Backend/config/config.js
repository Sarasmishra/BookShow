require('dotenv').config()

const config = {
    PORT:process.env.PORT,
    MONGO_URL:process.env.MONGO_URL,
    SALTROUND:process.env.SALTROUND,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRE:process.env.JWT_EXPIRE,
}

module.exports = config