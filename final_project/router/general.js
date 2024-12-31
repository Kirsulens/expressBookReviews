const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    if(isValid(username)){
      users.push({"username" : username, "password" : password })
      return res.status(200).json({message : `User ${username} , has successfully been added.`})
    }
    else{
      return res.status(400).json({message: `Username: ${username} already exists! Choose another name`}); 
    }
  }
  else{
    return res.status(400).json({message: "No Username or Password provided. Please try again."}); 
  }
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
      // console.log(books)
      return res.send(JSON.stringify(books, null, 2));
    });  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;  // Get the ISBN from the URL parameters
    // Check if the ISBN exists in the 'books' object
    if (books[isbn]) {
        // If the book is found, return the details as JSON
        return res.json(books[isbn]);
    } else {
        // If the book is not found, send a 404 error with a message
        return res.status(404).json({ error: `Book with ISBN ${isbn} not found` });
    }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Filter books by author
    results = []
    let author = req.params.author
    Object.entries(books).forEach( ([key,value]) => {
        if( value.author === author){
        results.push(books[key])
        }
    })
    return res.status(404).json({ message: "No books found for this author" });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    results = []
    let title = req.params.title
    Object.entries(books).forEach( ([key,value]) => {
      if(value.title === title){
        results.push(books[key])
      }
    })
    if(results.length == 0){
     return res.send(` No books with ${title} found!`)
    }
    else{
     return res.send(results)
    }
 });


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
        let isbn = req.params.isbn;
        if (books[isbn]) {
            // Check if the book has reviews
            if (books[isbn].reviews && books[isbn].reviews.length > 0) {
                return res.send(JSON.stringify(books[isbn].reviews, null, 2));
            } else {
                // If no reviews exist, send a custom message
                return res.status(404).json({ "message": "No reviews found for this book" });
            }
        } else {
            // If the book does not exist, send a 404 error with a message
            return res.status(404).json({ "message": "Book not found" });
        }
    });

module.exports.general = public_users;