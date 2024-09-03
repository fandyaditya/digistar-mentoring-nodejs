const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

module.exports = {
    userSchema
};


