const express = require('express')
const authorization = require('../middleware/auth.middleware')
const roleAuthorization = require('../middleware/role.middleware')
const { borrowBook, returnBook, getAllTransactions, getUserBorrowing } = require('../controllers/BorrowingTransaction.controller')
const recordRoute = express.Router()

recordRoute.post('/borrow',authorization,roleAuthorization('member'),borrowBook)
recordRoute.put('/return/:id',authorization,roleAuthorization('admin','member'),returnBook)
recordRoute.get('/borrowings',authorization,roleAuthorization('admin'),getAllTransactions)
recordRoute.get('/my-borrowings',authorization,roleAuthorization('member'),getUserBorrowing)

module.exports = recordRoute