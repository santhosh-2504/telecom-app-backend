import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register: Only used by you (admin) to register workers
export const registerUser = async (req, res) => {
  const { name, number, password, role = 'worker' } = req.body;

  try {
    const existingUser = await User.findOne({ number });
    if (existingUser) {
      return res.status(400).json({ message: 'Number already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      number,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { number, password } = req.body;

  try {
    const user = await User.findOne({ number }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    console.log(err);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Logout (client-handled)
export const logoutUser = async (req, res) => {
  res.json({ message: 'Logout handled on client' });
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('entries');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Get profile error:', err); 
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('entries');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

//Get all workers
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'worker' }).select('-password').populate('entries');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// POST /api/users/push-token
export const updatePushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;
    
    console.log('📱 Updating push token for user:', req.user.id);
    console.log('📱 Push token:', pushToken);
    
    if (!pushToken) {
      return res.status(400).json({ message: 'Push token is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { pushToken }, 
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Push token updated successfully for user:', req.user.id);
    res.json({ 
      message: 'Push token saved successfully',
      pushToken: updatedUser.pushToken 
    });
  } catch (err) {
    console.error('❌ Failed to save push token:', err);
    res.status(500).json({ 
      message: 'Failed to save push token',
      error: err.message 
    });
  }
};
