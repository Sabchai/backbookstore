const express = require('express')

const authRoute = express.Router()

const authSchema = require('../model/auth')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation,validation}=require('../middelware/RegisterValidation');
const { isAuth } = require('../middelware/isAuth');



// partie Register , 
//=>http://localhost:5002/auth/register

authRoute.post('/register',registerValidation,validation,async(req,res)=>{

try{
const {name,email,userName,password,role,phone,adresse}= req.body
const foundAuth = await authSchema.findOne({email})

if(foundAuth) {return res.status(404).json({msg:" el email deja mawjoud bara logi 3ych khouya ou okhty"})}

const newAuth = await new authSchema(req.body)
//bcrypt 
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(password, salt);

newAuth.password = hash 

newAuth.save()
res.status(200).json({msg:'welcome to ur note pad',newAuth})

}catch(err){
    console.log(err)
}
})
//=>http://localhost:5002/auth/login

authRoute.post('/login', loginValidation,validation,async (req, res) => {
    try {
      const { email, password } = req.body;
      const foundAuth = await authSchema.findOne({ email });
      if (!foundAuth) {
        return res.status(404).json({ msg: "rak mkch msejel, bara register 3aych khouya ou okhty" });
      }
  
      // Comparer le mot de passe fourni avec le mot de passe stocké
      const match = await bcrypt.compare(password, foundAuth.password);
      if (!match) {
        return res.status(404).json({ msg: "rak ghalit fil mdsp mte3ik" });
      }
      // Création du token avec le payload
      const payload = { id: foundAuth._id };
      const token = jwt.sign(payload, process.env.privateKey);
      res.status(200).json({ msg: "ur welcome, ya mar7abe", token, foundAuth });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Something went wrong, please try again." });
    }
  });


//route get profil view profil 
//http://localhost:5002/auth/myaccount

authRoute.get('/account',isAuth,(req,res)=>{
  try{
res.send(req.user)
  } catch(err){
  console.log(err)
 }
})







module.exports = authRoute