const express = require('express')
const { loginUser, registerUser, getAllUsers, getUserbyId, deleteUserById, updateUserById } = require('../controllers/user.controller')
const authorization = require('../middleware/auth.middleware')
const roleAuthorization = require('../middleware/role.middleware')
const parser = require('../middleware/CloudinaryUpload')
const userRoute = express.Router()


userRoute.get('/users',authorization,roleAuthorization('admin'),getAllUsers)
userRoute.get('/users/:id',authorization,getUserbyId)
userRoute.delete('/users/:id',authorization,deleteUserById)

userRoute.put("/users/:id", authorization, parser.single("avatar"), updateUserById);

userRoute.get('/profile',authorization,(req,res)=>{
    res.send(`Welcome to the ${req.user.name} profile`)
})

module.exports = userRoute