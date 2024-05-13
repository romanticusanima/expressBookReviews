const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    return users.some(user => user.username === username)
}

const authenticatedUser = (username, password) => { //returns boolean
    return users.some(user => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = authenticatedUser(username, password);

    if (user) {
        const accessToken = jwt.sign({ username: user.username }, 'fingerprint_customer', { expiresIn: '1h' });
        req.session.authorization = { accessToken }
        res.status(200).json({ accessToken, message: "You are successfully logged in!" });
    } else {
        res.status(400).json({ message: "User or password incorrect" })
    }

    return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { reviews } = req.body;

    const book = books[isbn];

    if (req.user) {
        if (book && book.reviews && typeof book.reviews === 'object') {
            book.reviews = { ...book.reviews, ...reviews };
            res.status(200).json({ message: "Review added successfully" });
        } else {
            res.status(400).json({ message: "Invalid review format. Expected an object." })
        }
    } else {
        res.status(404).json({ message: "Book not found" })
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];

    if (req.user) {
        if (book) {
            if (book.reviews) {
                delete book.reviews;
                res.status(200).json({ message: "Review deleted successfully!" })
            } else {
                res.status(404).json({ message: "No review found for this book" })
            }
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } else {
        res.status(403).json({ message: "User not authenticated" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
