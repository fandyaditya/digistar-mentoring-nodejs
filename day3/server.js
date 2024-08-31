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
app.use(bodyParser.json());

// Route to GET all users - returns the users array as JSON
app.get('/users', (req, res) => {
  res.json(users);
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Route to POST a new user - adds a new user to the users array
app.post('/users', (req, res) => {
  const user = req.body; // Extract the user from the request body
  users.push(user); // Add the new user to the users array
  res.status(201).json(user); // Respond with the created user and status code 201
});

// Route to PUT (update) a user by id
app.put('/users/:id', (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  const user = req.body; // Extract the updated user from the request body
  // Update the user in the users array
  users = users.map(u => (u.id == id ? user : u));
  res.json(user); // Respond with the updated user
});

// Route to DELETE a user by id
app.delete('/users/:id', (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  // Remove the user from the users array
  users = users.filter(u => u.id != id);
  res.status(204).end(); // Respond with status code 204 and no content
});

// Route to search users by name
app.get('/users/search', (req, res) => {
    const { name } = req.query; // Extract the name query parameter
  
    // Check if the name query parameter is provided
    if (!name) {
      return res.status(400).send({ message: "Name query parameter is required" });
    }
  
    // Filter users whose name matches the query parameter (case-insensitive)
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
  
    // Respond with the filtered users
    res.json(filteredUsers);
  });