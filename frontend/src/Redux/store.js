import { configureStore } from "@reduxjs/toolkit"
import AuthReducer  from './auth/AuthSlice'
import bookReducer   from './book/BookSlice'
import authorReducer from './author/AuthorSlice'
import borrowingReducer from './borrowing/BorrwingSlice'
import userReducer from './user/userSlice'
const store = configureStore({
    reducer:{
        auth:AuthReducer,
        book:bookReducer,
        author:authorReducer,
        borrowing:borrowingReducer,
        user:userReducer
    }
})

export default store