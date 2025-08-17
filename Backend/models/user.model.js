const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        unique:true,
        required:true,
        type:String,
        match: [/.+@.+\..+/, 'Please enter a valid email'],
    },
    password:
        {
            required:true,
            type:String
        }
    ,
    gender:{
        enum:['Male',"Female"],
        type:String
    },
    role:{
        type:String,
        enum:['admin','member'],
        default:'member'
    },
    avatar: {
        type: String,
        default: "", // will be updated when user selects avatar
      },
      
  // ✅ Personal Details
  phoneNumber: {
    type: String,
  },

  address: {
    type: String,
  },

  dob: {
    type: Date,
  },

  bio: {
    type: String,
  },

  favoriteGenre: {
    type: String,
  },

},
{
    timestamps:true
}
)

const userModel = mongoose.model('User',userSchema)

module.exports = userModel