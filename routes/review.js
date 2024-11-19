
// routes/review.js
const express = require("express");
const Review = require("../model/Review");
const Book = require("../model/Bookdata");
const User = require("../model/auth"); // Asumimos que tienes un modelo de usuario
const router = express.Router();

// Añadir una nueva reseña
// POST /review/add
router.post("/add", async (req, res) => {
  const { bookId, userId, rating, comment } = req.body;

  try {
    // Verificar si el libro existe
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Crear la nueva reseña
    const newReview = new Review({
      bookId,
      userId,
      rating,
      comment,
    });

    // Guardar la reseña en la base de datos
    await newReview.save();

    // Responder con éxito
    res.status(200).json({ msg: "Review added successfully", review: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error adding review", error: err });
  }
});

module.exports = router;
