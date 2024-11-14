const mongoose = require('mongoose')

const authSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    userName:{
        type:String
    },
    password:{type:String,
        required:true
    },
    role:{type:String,
        default:"user"
    },
    phone:{type:Number},
    adresse:{
        type:String
    }
})

module.exports = mongoose.model('auth',authSchema)