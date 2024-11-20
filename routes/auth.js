const express = require('express');
const authRoute = express.Router();
const authSchema = require('../model/auth');
// const bookSchema = require('../model/Bookdata');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, validation } = require('../middelware/RegisterValidation');
const { isAuth } = require('../middelware/isAuth'); 

// Register Route
authRoute.post('/register', registerValidation, validation, async (req, res) => {
  try {
    const { name, email, userName, password, role, phone, adresse } = req.body;

    const foundAuth = await authSchema.findOne({ email });
    if (foundAuth) {
      return res.status(404).json({ msg: "El email ya está registrado, por favor regístrate" });
    }

    const newAuth = new authSchema(req.body);

    // Hash the password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    newAuth.password = hash;

    await newAuth.save();
    res.status(200).json({ msg: 'Bienvenido a tu tienda de libros', newAuth });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Login Route
authRoute.post('/login', loginValidation, validation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundAuth = await authSchema.findOne({ email });
    if (!foundAuth) {
      return res.status(404).json({ msg: "Usuario no encontrado, por favor regístrate" });
    }

    // Check password match
    const match = await bcrypt.compare(password, foundAuth.password);
    if (!match) {
      return res.status(404).json({ msg: "Contraseña incorrecta" });
    }

    // Create JWT token
    const payload = { id: foundAuth._id };
    const token = jwt.sign(payload, process.env.privateKey);
    res.status(200).json({ msg: "Bienvenido", token, foundAuth });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Profile Route - Get user info
authRoute.get('/account', isAuth, (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = authRoute;
