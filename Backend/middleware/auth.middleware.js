const jwt = require('jsonwebtoken')
const config = require('../config/config')
const userModel = require('../models/user.model')

const authorization = async (req,res,next)=>{

    try {
        const token = req.headers.authorization?.split(" ")[1]

        if(!token){
            return res.status(401).json({message:"Token not found"})
        }

        const decodeData = jwt.verify(token,config.JWT_SECRET)

        const user = await userModel.findById(decodeData.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user
        next()
    } catch (error) {
        console.log("Error in authorization :",error)
        res.status(500).json({message:"token error"})
    }
}

module.exports = authorization