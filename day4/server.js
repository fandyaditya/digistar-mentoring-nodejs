const mongodb = require('./database/mongodb/db');
const userQuery = require('./database/mongodb/query'); 

mongodb.connectDB();



// Import the express module to create and configure the HTTP server
const express = require('express');
// Import the body-parser middleware to parse incoming request bodies
const bodyParser = require('body-parser');
// Initialize an Express application
const app = express();
// Define the port number on which the server will listen
const PORT = 3000;

// Initialize an array to store user data
let users = [];

// Middleware to parse JSON bodies
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Route to GET all users - returns the users array as JSON
app.get('/users', (req, res) => {
  userQuery.getUsers().then((users) => {
    res.json(users);
  });
});

// Route to POST a new user - adds a new user to the users array
app.post('/users', (req, res) => {
  const user = req.body; // Extract the user from the request body
  console.log(req);
  userQuery.createUser(user).then((user) => {
    res.status(201).json(user); // Respond with the created user and status code 201
  })
});
  

// Route to PUT (update) a user by id
app.put('/users/:id', (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  const user = req.body; // Extract the updated user from the request body
  userQuery.updateUser(id, user).then((user) => {
    res.status(200).json(user); // Respond with the updated user
  });
});

// Route to DELETE a user by id
app.delete('/users/:id', (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  userQuery.deleteUser(id).then(() => {
    res.status(204).send(); // Respond with no content and status code 204
  });
});

// Route to search users by name
app.get('/users/search', (req, res) => {
    const { name } = req.query; // Extract the name query parameter
  
    // Check if the name query parameter is provided
    if (!name) {
      return res.status(400).send({ message: "Name query parameter is required" });
    }
    userQuery.findByName(name).then((users) => {
      res.status(200).json(users); // Respond with the filtered users
    });    
});