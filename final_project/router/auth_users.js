const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bodyParser = require('body-parser');
let users = [];
regd_users.use(bodyParser.json());

const isValid = (username)=>{
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let validUsers = users.filter((user) => {
        return (user.username === username & user.password === password);
      })
      // Return true if any valid user is found, otherwise false
      if (validUsers.length > 0) {
        return true;
      } else {
        return false;
      }
    }

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  console.log('Users registered')
  if(users.length == 0){
    console.log('users array is empty')
  }
  else{
    for(var i = 0; i < users.length; i++){
      console.log(users[i])
    }
  }

  if(authenticatedUser(username, password)){
    console.log('accessToken is made')
    let accessToken = jwt.sign(
      {username},
      'access',
      {expiresIn : 60 * 60 * 24});
    
    req.session.authorization = {accessToken, username}
    return res.status(200).send(`User ${username} successfully logged in. Token is ${accessToken}`)
  }
  else{
    return res.status(500).json({message: "Invalid Login. Username and Password not recognized."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    const review = req.body.review; // Using req.body for better practice
    const username = req.session.authorization?.username;
    console.log("the req.session.authorization objected here \n ", req.session.authorization);
    if (!username) {
      return res.status(401).send('User is not logged in. Please login to proceed.');
    }
    if (!books[isbn]) {
      return res.status(404).send(`Book with ISBN ${isbn} not found.`);
    }
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review; // Add or update the review
    return res.status(200).json({ message: "Review added/updated successfully!" });
  });

//The code for deleting a book review
//Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’.
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    if (!username) {
      return res.status(401).send('User is not logged in. Please login to proceed.');
    }
  
    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).send('Review not found.');
    }
  
    delete books[isbn].reviews[username]; // Delete the review
    return res.status(200).json({ message: "Review deleted successfully!" });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
