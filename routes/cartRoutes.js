const express = require("express");
const Cart = require("../model/cart");
const Book = require("../model/Bookdata"); // Import your Book model to validate book availability
const router = express.Router();

// Add a book to the cart
router.post("/add", async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    // Check if the book is in stock
    if (book.quantityAvailable < quantity) {
      return res.status(400).json({ msg: `Not enough stock for ${book.title}` });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the cart does not exist, create a new cart
      cart = new Cart({
        userId,
        books: [{ bookId, quantity }],
      });
    } else {
      // If the cart exists, check if the book is already in the cart
      const bookIndex = cart.books.findIndex(item => item.bookId.toString() === bookId);
      if (bookIndex >= 0) {
        // Update the quantity of the existing book
        cart.books[bookIndex].quantity += quantity;
      } else {
        // Add the book to the cart if not already present
        cart.books.push({ bookId, quantity });
      }
    }

    // Save the cart to the database
    await cart.save();
    res.status(200).json({ msg: "Book added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error adding book to cart", error: err });
  }
});

// Remove a book from the cart
router.delete("/remove", async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // Remove the book from the cart
    cart.books = cart.books.filter(item => item.bookId.toString() !== bookId);

    // Save the updated cart
    await cart.save();
    res.status(200).json({ msg: "Book removed from cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error removing book from cart", error: err });
  }
});

// View the user's cart
router.get("/:userId", async (req, res) => {  // Change from "/" to "/:userId"
    const { userId } = req.params;  // Change from req.query to req.params
  
    try {
      const cart = await Cart.findOne({ userId }).populate("books.bookId");
  
      if (!cart) {
        return res.status(404).json({ msg: "Cart is empty" });
      }
  
      res.status(200).json({ msg: "Cart retrieved", cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error fetching cart", error: err });
    }
  });

// Update the quantity of a book in the cart
router.put("/update", async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // Find the book in the cart and update its quantity
    const bookIndex = cart.books.findIndex(item => item.bookId.toString() === bookId);
    if (bookIndex === -1) {
      return res.status(404).json({ msg: "Book not found in cart" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ msg: "Quantity must be greater than zero" });
    }

    cart.books[bookIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();
    res.status(200).json({ msg: "Cart updated", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating cart", error: err });
  }
});

module.exports = router;
