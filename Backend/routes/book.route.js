const express = require('express')
const authorization = require('../middleware/auth.middleware')
const roleAuthorization = require('../middleware/role.middleware')
const { createBook, getAllBooks, getBookById, updateBookById, deleteBookById, getAllBooksRaw, addReviewToBook } = require('../controllers/book.controller')
const parser = require('../middleware/CloudinaryUpload')
const bookRoute = express.Router()

bookRoute.post(
    "/books",
    authorization,
    roleAuthorization("admin"),
    parser.single("coverImage"), // this matches form input field name
    createBook
  );
bookRoute.get('/books',authorization,getAllBooks)
bookRoute.get('/books/all',authorization,getAllBooksRaw)
bookRoute.get('/books/:id',getBookById)
bookRoute.put('/books/:id',authorization,roleAuthorization('admin'),updateBookById)
bookRoute.delete('/books/:id',authorization,roleAuthorization('admin'),deleteBookById)
bookRoute.post('/books/:id/review', authorization, addReviewToBook)


module.exports = bookRoute