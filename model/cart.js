//store information about the user's cart: which book in the cart and how many of each book we have 

const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // assuming a User model exists
  books: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);
