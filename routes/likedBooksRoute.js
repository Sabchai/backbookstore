
const express = require('express');
const likedBooksRoute = express.Router();
const authSchema = require('../model/auth');
const bookSchema = require('../model/Bookdata');
const likedBooksSchema = require('../model/LikedBooks');
const { isAuth } = require('../middelware/isAuth');

// Add Book to Liked Books (Favorites)
likedBooksRoute.post('/add', isAuth, async (req, res) => {
    try {
        const { bookId } = req.body;
        if (!bookId) {
            return res.status(400).json({ msg: 'Book ID is required' });
        }

        // Check if the book exists
        const book = await bookSchema.findById(bookId);
        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        // Find or create liked books entry for the user
        let likedBooksEntry = await likedBooksSchema.findOne({ userId: req.user._id });

        if (!likedBooksEntry) {
            likedBooksEntry = new likedBooksSchema({ userId: req.user._id, likedBooks: [bookId] });
        } else {
            // Check if the book is already liked
            if (likedBooksEntry.likedBooks.includes(bookId)) {
                return res.status(400).json({ msg: 'Book already in favorites' });
            }

            // Add the book to the likedBooks array
            likedBooksEntry.likedBooks.push(bookId);
        }

        await likedBooksEntry.save();

        res.status(200).json({
            msg: 'Book added to favorites successfully',
            likedBooks: likedBooksEntry.likedBooks
        });

    } catch (err) {
        console.error('Add to favorites error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get User's Liked Books
likedBooksRoute.get('/list', isAuth, async (req, res) => {
    try {
        const likedBooksEntry = await likedBooksSchema.findOne({ userId: req.user._id })
            .populate('likedBooks');  // Populate the book details
        
        if (!likedBooksEntry) {
            return res.status(404).json({ msg: 'No liked books found' });
        }

        res.status(200).json({
            likedBooks: likedBooksEntry.likedBooks
        });
    } catch (err) {
        console.error('Get liked books error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = likedBooksRoute;