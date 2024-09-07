// npm install mongoose uuid

const User = require('../models/user_model');

// Function to find a user by their ID
async function findOneByUserId(userId) {
  try {
    // Find the user by ID
    const user = await User.findOne({ user_id: userId });
    return user;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

// Function to find a user by their email
async function findOneByEmail(email) {
  try {
      // Find the user by email
      const user = await User.findOne({ email: email });
      return user;
  } catch (error) {
      console.error('Error finding user:', error);
      throw error;
  }
}

// Function to find all users
async function findAll() {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error('Error finding users:', error);
    throw error;
  }
}

// Function to save a new user
async function create(user) {
  try {

    // Create a new user
    const newUser = new User(user);

    // Save the user to the database
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Function to update a user by ID
async function updateOne(userId, updateData) {
  try {
    // Find the user by ID
    const existingUser = await User.findOne({ user_id: userId });
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Exclude the _id field from the update data
    delete updateData._id;

    // Update the user's data
    Object.assign(existingUser, updateData);

    // Set the updated_at field to the current time
    existingUser.updated_at = new Date();

    // Save the updated user to the database
    const updatedUser = await existingUser.save();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

module.exports = { findOneByUserId, findOneByEmail, findAll, create, updateOne };