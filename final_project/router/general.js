const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const id = req.params.isbn;
    res.send(books[id]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const booksList = Object.keys(books);
    let result;
    booksList.forEach(index => {
        const book = books[index];
        if (book.author === req.params.author) {
            result = books[index];
        }
    })
    res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const booksList = Object.keys(books);
    let result;
    booksList.forEach(index => {
        const book = books[index];
        if (book.title === req.params.title) {
            result = books[index];
        }
    })
    res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const id = req.params.isbn;
    res.send(books[id]?.reviews);
});

module.exports.general = public_users;
