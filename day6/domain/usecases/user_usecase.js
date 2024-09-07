// npm install mongoose uuid

const repository = require('../repositories/user_repository');
const roleRepository = require('../repositories/role_repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Function to find a user by their ID
async function getOneByUserId(userId) {
  try {
    // Find the user by ID
    const user = await repository.findOneByUserId(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const dataRole = await roleRepository.getOneByRoleId(user.role)

    const role = {
      role_id: dataRole.role_id,
      name: dataRole.name,
      position: dataRole.position,
      stacks: dataRole.stacks
    };
    
    const userWithRole = {
      user_id: user.id,
      username: user.username,
      email: user.email,
      role: role,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    return userWithRole;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to find a user by their email
async function getOneByEmail(email) {
  try {
    // Find the user by email
    const user = await repository.findOneByEmail(email);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to find all users
async function getList() {
  try {
    // Find all users
    const users = await repository.findAll(); 
    const result = []
    for (const user of users) {
      const dataRole = await roleRepository.getOneByRoleId(user.role);
      
      const role = {
        role_id: dataRole.role_id,
        name: dataRole.name,
        position: dataRole.position,
        stacks: dataRole.stacks
      };
      
      const userWithRole = {
        user_id: user.id,
        username: user.username,
        email: user.email,
        role: role,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
      
      result.push(userWithRole);
    }
    return result;
  } catch (error) {
    console.error('Error finding users:', error);
    throw error;
  }
}

// Function to register a new user
async function register(user) {
  try {

    // Generate a unique user_id
    user.user_id = uuidv4();

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10); // 10 is the saltRounds
    user.password = hashedPassword;

    const dataRole = await roleRepository.getOneByName(user.role);
    const roleId = dataRole.role_id
    user.role = roleId;

    // Save the user to the database
    const savedUser = await repository.create(user);
    return savedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to log in a user
async function login(payload) {
  try {
    const checkUser = await repository.findOneByEmail(payload.email);
    if (!checkUser) {
      throw new Error('Invalid email or password');
    }
    const user = {
      userId: checkUser.user_id,
      email: checkUser.email,
      password: checkUser.password
    };
    const isValidPassword = await bcrypt.compareSync(payload.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    const key = process.env.JWT_SECRET; // Use environment variable for the secret key or a default one
    const token = jwt.sign(user, key, { expiresIn: '30m' }); // Set token expiration to 15 minutes
    return token;
  } catch (error) {
    console.error('Error login: ', error);
    throw error;
  }
}

// Function to update a user by their ID
async function updateOne(updateData) {
  try {
    const userId = updateData.user_id;
    // Save the updated user to the database
    const updatedUser = await repository.updateOne(userId, updateData);
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {getOneByUserId, getOneByEmail, getList, register, login, updateOne};