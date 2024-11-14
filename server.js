const express = require('express')
const app =express()
require('dotenv').config()
app.use(express.json());

const port = process.env.PORT || 5005
const db = require('./config/db')
const noteRoute = require('./routes/book');
const authRoute = require('./routes/auth');
const cors = require('cors')
// appel db
db()
//path principale mte3 el bloc de note mte3i 
app.use(cors())

app.use('/book',noteRoute)
//partie auth 
app.use('/auth',authRoute)



app.listen(port,(err)=>{
    err?console.log(err) : console.log(`http://localhost:${port}`)
})