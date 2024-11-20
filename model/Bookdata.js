const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    price: { type: Number, required: true },
    publicationYear: { type: Number, required: true },
    description: { type: String },
    quantityAvailable: { type: Number, required: true },
    category: { 
        type: String, 
        enum: [
            'novels', 
            'history', 
            'linguistics', 
            'science', 
            'philosophy', 
            'art', 
            'technology', 
            'psychology'
        ], 
        required: true 
    },

    
    });


module.exports = mongoose.model("Book", bookSchema);
