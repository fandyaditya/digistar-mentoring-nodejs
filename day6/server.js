// npm install express bcrypt dotenv

const loadEnv = require('./config/env');
// Call the function to load environment variables
loadEnv();
const express = require("express");
const connectDB = require('./db/mongodb');
const userUsecase = require('./domain/usecases/user_usecase');
const roleUsecase = require('./domain/usecases/role_usecase');
const jwtAuth = require('./middlewares/jwt');
const { initializePassport, authenticatePassportJwt } = require('./middlewares/passport-jwt');

const PORT = 7000;
const app = express();

// Middleware to parse JSON bodies (for Express 4.16.0 and above)
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize Passport
app.use(initializePassport());

// Create a router
const router = express.Router();

// Mount the router on the app under the /digistar base path
app.use('/digistar', router);

// Login API endpoint
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const payload = {
      email,
      password
    };
    const token = await userUsecase.login(payload);
    res.status(200).json({ message: "Success login!", token });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message});
  }
});

// Registration API endpoint
router.post("/user/register", async (req, res) => {
  try {

    // Validate request data (Implement validation logic as needed)
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await userUsecase.getOneByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, Email, and password are required" });
    }

    const user = {
      username,
      email,
      password, 
      role
    };

    // Create user
    const newUser = await userUsecase.register(user)

    // Respond with success message (Consider returning the created user ID or similar)
    res.status(201).json({ message: "User created successfully", userId: newUser.id });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message});
  }
});

// Get all users API endpoint with JWT authentication
router.get("/user", jwtAuth, async (req, res) => {
  try {
    // Retrieve all users from the userUsecasesitory
    const users = await userUsecase.getList();

    // Respond with the users array
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message});
  }
});

// Get user by ID API endpoint with JWT authentication
router.get("/user/:id", authenticatePassportJwt(), async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userUsecase.getOneByUserId(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: 'Error Not Found', message: err.message});
  }
});

// Update user by ID API endpoint with JWT authentication
router.put("/user/:id", jwtAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await userUsecase.getOneByUserId(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    existingUser.username = username || existingUser.username;
    existingUser.email = email || existingUser.email;
    existingUser.password = password || existingUser.password;

    // Save the updated user
    const updatedUser = await userUsecase.updateOne(existingUser);

    // Respond with success message (Consider returning the updated user or similar)
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message});
  }
});

// Create role API endpoint
router.post("/role", async (req, res) => {
  try {
    const { name, position, stacks } = req.body;

    // Validate request data (Implement validation logic as needed)
    if (!name || !position || !stacks) {
      res.status(400).json({ message: "Name, Position, and Stacks are required" });
    }

    const role = {
      name,
      position,
      stacks
    };

    // Create role API endpoint
    const newRole = await roleUsecase.create(role);

    // Respond with success message (Consider returning the created role ID or similar)
    res.status(201).json({ message: "Role created successfully", roleId: newRole.id });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message});
  }
})

// Get all roles API endpoint
router.get("/role", async (req, res) => {
  try {
    // Retrieve all users from the userUsecasesitory
    const roles = await roleUsecase.getList();

    // Respond with the users array
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message});
  }
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});