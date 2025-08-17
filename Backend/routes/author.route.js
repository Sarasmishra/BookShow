const express = require('express')
const { createAuthor, getAllAuthors, getAuthorById, updateAuthorById, deleteAuthorById, getAllAuthorsRaw } = require('../controllers/author.controller')
const authorization = require('../middleware/auth.middleware')
const roleAuthorization = require('../middleware/role.middleware')
const AuthorRoute = express.Router()

AuthorRoute.post('/authors',authorization,roleAuthorization('admin'),createAuthor)
AuthorRoute.get('/authors',authorization,getAllAuthors)
AuthorRoute.get('/authors/all',authorization,roleAuthorization('admin'),getAllAuthorsRaw)
AuthorRoute.get('/authors/:id',authorization,getAuthorById)
AuthorRoute.put('/authors/:id',authorization,roleAuthorization('admin'),updateAuthorById)
AuthorRoute.delete('/authors/:id',authorization,roleAuthorization('admin'),deleteAuthorById)

module.exports = AuthorRoute