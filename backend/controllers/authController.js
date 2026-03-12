import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';

// Helper function to generate the JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new business (Tenant) and its Admin user
// @route   POST /api/auth/register
export const registerBusiness = async (req, res) => {
  try {
    const { businessName, fullName, email, password } = req.body;

    // 1. Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create the new Tenant (The Business)
    const tenant = await Tenant.create({
      businessName,
      contactEmail: email,
    });

    // 3. Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the Admin User and link them to the new Tenant's ID
    const user = await User.create({
      tenantId: tenant._id, // This is the most crucial step for multi-tenancy!
      fullName,
      email,
      password: hashedPassword,
      role: 'Admin', // The person registering the business is the Admin
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        token: generateToken(user._id), // Send the token to the frontend
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists AND the password matches the hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};