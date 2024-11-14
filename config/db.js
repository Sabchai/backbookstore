const mongoose = require('mongoose')

const db=async()=>{
    try{
await mongoose.connect(process.env.MONGO_URL)
console.log('saret el rabtan c bon ')

    }catch(err){
        console.log(err)
    }
}

module.exports= db