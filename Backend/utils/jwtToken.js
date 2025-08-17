const jwt = require('jsonwebtoken')
const {JWT_EXPIRE,JWT_SECRET} = require('../config/config')

const generate = (userId,userRole)=>{
    return jwt.sign({id:userId,role:userRole },JWT_SECRET,{expiresIn:JWT_EXPIRE})
}

module.exports = generate