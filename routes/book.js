const express = require("express");
const Bookroute = express.Router();
const bookSchema = require("../model/Bookdata");

// Route to get all books
// http://localhost:5000/book/getall
Bookroute.get('/getall', async (req, res) => {
    try {
        const books = await bookSchema.find();
        res.status(200).json({ msg: 'You got all books', books });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error fetching books" });
    }
});

// Route to add a new book
// http://localhost:5000/book/addbook
Bookroute.post('/addbook', async (req, res) => {
    try {
        const { category } = req.body;

        // Verifica que la categoría esté en la lista permitida
        const validCategories = ['novels', 'history', 'linguistics', 'science', 'philosophy', 'art', 'technology', 'psychology'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ msg: `Invalid category. Please choose from: ${validCategories.join(', ')}.` });
        }

        const newbook = new bookSchema(req.body);
        await newbook.save();
        res.status(200).json({ msg: 'You added the book', newbook });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: "Error adding book" });
    }
});

// Route to update a book by ID
// http://localhost:5000/book/update/:id
Bookroute.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { category } = req.body;

        // Verifica que la categoría esté en la lista permitida antes de actualizar
        const validCategories = ['novels', 'history', 'linguistics', 'science', 'philosophy', 'art', 'technology', 'psychology'];
        if (category && !validCategories.includes(category)) {
            return res.status(400).json({ msg: `Invalid category. Please choose from: ${validCategories.join(', ')}.` });
        }

        const updatebook = await bookSchema.findByIdAndUpdate(id, { $set: { ...req.body } }, { new: true });
        if (!updatebook) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(200).json({ msg: 'Your book was updated', updatebook });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error updating book" });
    }
});

// Route to delete a book by ID
// http://localhost:5000/book/delete/:id
Bookroute.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletebook = await bookSchema.findByIdAndDelete(id);
        if (!deletebook) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(200).json({ msg: 'You deleted the book' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error deleting book" });
    }
});

// Route to get a unique book by ID
// http://localhost:5000/book/getunique/:id
Bookroute.get('/getunique/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getbook = await bookSchema.findById(id);
        if (!getbook) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.status(200).json({ msg: 'You got the unique book', getbook });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error fetching the book" });
    }
});

// Route to get books by category
// http://localhost:5000/book/category/:category
Bookroute.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;

        // Verifica que la categoría esté en la lista permitida
        const validCategories = ['novels', 'history', 'linguistics', 'science', 'philosophy', 'art', 'technology', 'psychology'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ msg: `Invalid category. Please choose from: ${validCategories.join(', ')}.` });
        }

        const books = await bookSchema.find({ category: category });
        if (books.length === 0) {
            return res.status(404).json({ msg: 'No books found in this category' });
        }
        res.status(200).json({ msg: `You got books from category: ${category}`, books });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error fetching books by category" });
    }
});

module.exports = Bookroute;
