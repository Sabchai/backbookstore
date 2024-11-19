const express = require('express')
const app =express()
require('dotenv').config()
app.use(express.json());

const port = process.env.PORT || 5005
const db = require('./config/db')
const noteRoute = require('./routes/book');
const authRoute = require('./routes/auth');
const cartRoute = require('./routes/cartRoutes');
const reviewRoute = require("./routes/review"); 
const cors = require('cors')
// appel db
db()
//path principale mte3 el bloc de note mte3i 
app.use(cors())
// book routes 
app.use('/book',noteRoute)
//partie auth 
app.use('/auth',authRoute)
// cart routes 
app.use('/cart', cartRoute); 
// review routes 
app.use("/review", reviewRoute);



app.listen(port,(err)=>{
    err?console.log(err) : console.log(`http://localhost:${port}`)
})