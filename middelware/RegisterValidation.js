const {body,validationResult} =require('express-validator')


exports.registerValidation=[
    body('email',"please enter a valid email format exp@gmail.com").isEmail(),
    body('password',"please a9al min 8 car ").isLength({min:8})
]

exports.loginValidation=[
    body('email',"please enter a valid email format exp@gmail.com").isEmail(),
]

exports.validation=(req,res,next)=>{
    const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
next()
}