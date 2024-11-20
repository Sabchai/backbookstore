const mongoose = require('mongoose');

// Order schema
const orderSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'auth', 
        required: true 
    },
    books: [
        {
            bookId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Book',
                required: true 
            },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    orderStatus: { 
        type: String, 
        enum: ['pending', 'completed', 'cancelled'], 
        default: 'pending' 
    },

    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid'], 
        default: 'pending' 
    },
    orderDate: { type: Date, default: Date.now }
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
