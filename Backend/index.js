const config = require('./config/config')
const express = require('express')
const cors = require('cors')
const dbConnection = require('./config/db')
const userRoute = require('./routes/user.route')
const AuthorRoute = require('./routes/author.route')
const bookRoute = require('./routes/book.route')
const recordRoute = require('./routes/borrowingTransaction.route')
const { registerUser, loginUser } = require('./controllers/user.controller')
const app = express()
const port = config.PORT

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: 'GET,POST,PUT,DELETE,PATCH', // Allow these methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
  };
  
  // Enable CORS
  app.use(cors(corsOptions));




app.use(express.json());


app.get('/',(req,res)=>{
    res.send("Testing Server")
})
app.post('/api/register',registerUser)
app.post('/api/login',loginUser)




app.use('/api',userRoute)
app.use('/api',AuthorRoute)
app.use('/api',bookRoute)
app.use('/api',recordRoute)



app.listen(port,()=>{
    dbConnection()
    console.log(`Server is listening in PORT: ${port}`)
})