const bcrypt = require('bcryptjs')
const userModel = require('../models/user.model')
const { SALTROUND } = require('../config/config')
const generate = require('../utils/jwtToken')
const config = require('../config/config')
const isSelforAdmin = require('../utils/isSelforAdmin')




const registerUser = async (req,res)=>{
    try {
        const {name,email,password,gender} = req.body
        
        // 1. check all the fields are filled or not 
        if(!name || !password || !email){
            return res.status(409).json({ message: "All required fields must be filled." })
        }

        // 2. check if the user is already present or not
        const isUser = await userModel.findOne({email})
        if(isUser){
            return res.status(400).json({message:"User already exist"})
        }


        // 3. if not Then hash the password 
        const hashPassword = await bcrypt.hash(password,Number(SALTROUND))

        // 4. NOw make the new user 
        const newUser = new userModel({name,email,password:hashPassword,gender,role:'member'})

        // 5.save the user in db
        const user = await newUser.save()

        return res.status(201).json({message:"User created Successfully",user:user})

        
    } catch (error) {
        console.log("Error in registration",error)
        res.status(500).json({message:"User failed to create",error:error.message})
    }
}


const loginUser = async (req,res)=>{
    try {
        const {email,password}= req.body
        if(!email || !password){
            return res.status(400).json({message:"All field should be filled"})
        }

        const user = await userModel.findOne({email})
        if(!user){
         return    res.status(404).json({message:"User not found"})
        }

       const matching = await bcrypt.compare(password,user.password)

       if(!matching){
        return res.status(401).json({message:"Password is incorrect"})
       }

       const token = generate(user._id,user.role)

       if(!token){
        return res.status(409).json({message:"Token not generated"})
       }

       res.status(200).json({message:"Login Successfully",token:token,user:user})


    } catch (error) {
        console.log("ERROR WHILE LOGIN :",error)
        res.status(500).json({message:"Login Failed",error:error.message})
    }
}








const getAllUsers = async (req,res)=>{
    try {
        const users = await userModel.find().select('-password')  // this will remove password
        res.status(200).json(users)
    } catch (error) {
        console.log("Error in getting all Users :",error)
        res.status(500).json({message:{
            errorname:error.name,
            error:error,
            errorM:error.message
        },})
    }
}


const getUserbyId = async (req,res)=>{
    try {

 
        const user = await userModel.findById(req.params.id).select('-password')

        if(!user){
            return res.status(404).json({message:"User not found"})

        }

        res.status(200).json(user)

    } catch (error) {
        console.log("Error in getting  User :",error)
        res.status(500).json({message:"Failed to fetch user",error:error.message})
    }
}

const updateUserById = async (req, res) => {
    try {
      const updateData = {};
  
      // Basic info
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.email) updateData.email = req.body.email;
  
      // Password (hashed)
      if (req.body.password) {
        const newPassword = await bcrypt.hash(req.body.password, Number(config.SALTROUND));
        updateData.password = newPassword;
      }
  
      // Avatar upload
      if (req.file && req.file.path) {
        updateData.avatar = req.file.path;
      }
  
      // ✅ Add new fields
      if (req.body.phoneNumber) updateData.phoneNumber = req.body.phoneNumber;
      if (req.body.address) updateData.address = req.body.address;
      if (req.body.dob) updateData.dob = new Date(req.body.dob); // Cast to Date
      if (req.body.bio) updateData.bio = req.body.bio;
      if (req.body.favoriteGenre) updateData.favoriteGenre = req.body.favoriteGenre;
  
      // No updates sent
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
  
      // Find and update user
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true }
      );
  
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("User not updated:", error);
      res.status(500).json({ message: "Update failed" });
    }
  };
  


const deleteUserById = async (req,res)=>{
    try {
        if(!isSelforAdmin(req.user.role,req.params.id)){
            return res.staus(403).json({message:"Access Denied"})
        }
        await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"User deleted Successfully"})
    } catch (error) {
        console.log("Error in deletion",error)
        res.status(500).json({message:"Failed to delete user"})
    }
}



module.exports = {registerUser,loginUser,getAllUsers,getUserbyId,updateUserById,deleteUserById}