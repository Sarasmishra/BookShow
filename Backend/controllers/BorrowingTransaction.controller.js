const bookModel = require("../models/book.model")
const borrowingTransactionModel = require('../models/borrowingTransaction.model')


const borrowBook = async(req,res)=>{
    try {
        const {bookId,dueDate} = req.body
        const userId = req.user._id


        if(!bookId || !dueDate) return res.status(400).json({message:"All field be completed "})

        const book = await bookModel.findById(bookId)
        
        if(!book) return res.status(404).json({message:"Book not found"})

        if(book.copiesAvailable <=0) return res.status(400).json({message:"No copies available"})

        //  create a transaction
    const transaction = new borrowingTransactionModel({book:bookId,member:userId,dueDate})

    const saveTansaction = await transaction.save()

    book.copiesAvailable-=1
    book.borrowedBy.push(userId)
    await book.save()

    res.status(201).json({message:"Transaction completed successfully",transactionDetails:transaction})


    } catch (error) {
        console.log("eroor to borrow book",error)
        res.status(500).json({message:"Failed to borrow book"})
    }
}

const getAllTransactions = async (req,res)=>{
    try {
        const transaction = await borrowingTransactionModel.find().populate('book').populate('member')
        if(transaction.length === 0) return res.status(404).json({message:"Transaction not found"})
        
        res.status(200).json({AllTransactions:transaction})    
    } catch (error) {
        console.log("Error to get transaction",error)
        res.status(500).json({message:"Failed to fetch transaction"})
    }
}
const getUserBorrowing = async (req,res)=>{
    try {
        const borrowingByUser = await borrowingTransactionModel.find({member:req.user._id}).populate('book')
        res.status(200).json({allBorrowing:borrowingByUser})
    } catch (error) {
        console.log("Error to get user borrowing",error)
        res.status(500).json({message:"Failed to get user Borrowing"})
    }
}

const returnBook = async (req,res)=>{
    try {
        const transactionId = req.params.id
        const userId = req.user._id

        const transaction = await borrowingTransactionModel.findById(transactionId) 
        if(!transaction) return res.status(404).json({message:"No transaction found"})

        if(req.user.role !== 'admin' && transaction.member.toString() !== userId.toString()) return res.status(403).json({message:"You can only return you own book"})
         
        if(transaction.status === 'Returned')  return res.status(400).json({message:"Book alreadu returned"})   
        
        transaction.status = "Returned"
        transaction.returnDate = new Date()
        await transaction.save()

        await bookModel.findByIdAndUpdate(transaction.book,{
            $inc:{copiesAvailable:1}
        })

        res.status(200).json({message:"Book returned",transaction})


    } catch (error) {
        console.log("Error to return Book",error)
        res.status(500).json({message:"Failed to return Book"})
    }
}

module.exports = {borrowBook,getAllTransactions,getUserBorrowing,returnBook}