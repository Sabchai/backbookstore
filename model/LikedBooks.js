
// models/LikedBooks.js
const mongoose = require('mongoose');

const likedBooksSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth', 
        required: true
    },
    likedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book' 
    }]
});

module.exports = mongoose.model('LikedBooks', likedBooksSchema);
