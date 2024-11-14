var jwt = require('jsonwebtoken');

const authSchema = require('../model/auth')

exports.isAuth=async(req,res,next)=>{
    try{

     const token = req.header('Authorization')
    
     var decoder = jwt.verify(token,process.env.privateKey)

     if(!decoder){return res.status(404).json({msg:'ynejimich yodkhel'})}

     const user = await authSchema.findById(decoder.id)
     req.user = user
     
        next()
    }catch(err){

    }
}