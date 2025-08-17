const mongoose = require('mongoose')

const borrowingTransactionSchema = mongoose.Schema({
book:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Book"
},
member:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
borrowDate:{
    type:Date,
    default:Date.now
},
dueDate:{
    type:Date,
    required:true
},
returnDate:{
    type:Date,
    
},
status:{
    type:String,
    enum:["Borrowed","Returned"],
    default:"Borrowed"
}

},
{
    timestamps:true
})

const borrowingTransactionModel = mongoose.model('BorrowingTransaction',borrowingTransactionSchema)
module.exports = borrowingTransactionModel