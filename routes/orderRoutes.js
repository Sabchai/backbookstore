const express = require('express');
const Book = require('../model/Bookdata');  
const User = require('../model/auth');  
const Order = require('../model/Order');  

const router = express.Router();

// 1. Create a new order
router.post('/create-order', async (req, res) => {
    try {
        const { userId, books, paymentMethod } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if books are available
        let totalPrice = 0;
        for (let i = 0; i < books.length; i++) {
            const book = await Book.findById(books[i].bookId);

            if (!book) {
                return res.status(400).json({ message: `Book with ID ${books[i].bookId} not found` });
            }

            // Check if the category is missing
            if (!book.category) {
                return res.status(400).json({ message: `Book with ID ${books[i].bookId} is missing a category` });
            }

            // Check if there is enough stock
            if (book.quantityAvailable < books[i].quantity) {
                return res.status(400).json({ message: `Not enough stock for ${book.title}` });
            }

            // Calculate the total price
            totalPrice += book.price * books[i].quantity;

            // Reduce the available quantity in stock
            book.quantityAvailable -= books[i].quantity;
            await book.save();
        }

        // Create the order
        const newOrder = new Order({
            userId,
            books: books.map(item => ({
                bookId: item.bookId,
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice,
            paymentStatus: paymentMethod === 'payAfterDelivery' ? 'pending' : 'paid',
            orderStatus: 'pending'
        });

        // Save the order to the database
        await newOrder.save();

        // Return the order details in the response
        res.status(201).json({
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});

// 2. Get order details by order ID
router.get('/order/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('books.bookId', 'title price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 3. Get all orders for a specific user
router.get('/orders/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
                                  .populate('books.bookId', 'title price')
                                  .sort({ orderDate: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 4. Update order status (e.g., mark as completed or cancelled)
router.put('/update-order-status', async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Validate status
        if (!['pending', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order status
        order.orderStatus = status;
        await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 5. Delete an order (optional)
router.delete('/delete-order/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Restore book quantities (optional)
        for (let i = 0; i < order.books.length; i++) {
            const book = await Book.findById(order.books[i].bookId);
            if (book) {
                book.quantityAvailable += order.books[i].quantity;
                await book.save();
            }
        }

        // Delete the order
        await order.remove();

        res.status(200).json({
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
