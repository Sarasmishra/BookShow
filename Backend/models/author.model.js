const mongoose = require('mongoose')


const authorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    biography:String,
    dateOfBirth:{
        type:Date
    },
    nationality:String,
    coverImage: {
        type: String,
        default: "", // or a placeholder image URL
      },
    

    books:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Book"

        }
    ]
},
{
    timestamps:true
})

const authorModel = mongoose.model("Author",authorSchema)

module.exports = authorModel