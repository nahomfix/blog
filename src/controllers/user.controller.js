const User = require('../models/user.model');
const argon2 = require('argon2');
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const register = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;

  if (User.exists({ username: username })) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Username already exits');
  }

  const hashedPassword = await argon2.hash(password);
  try {
    const user = new User({
      name,
      username,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!User.exists({ username: username })) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('User not found');
  }

  const userInSystem = await User.findOne({ username: username });
  const passwordMatches = await argon2.verify(userInSystem.password, password);
  if (passwordMatches) {
    const token = jwt.sign(
      { id: userInSystem._id, username: userInSystem.username },
      process.env.JWT_SECRET
    );
    res.cookie('token', token, { maxAge: 900000, httpOnly: true });
    res.json({
      success: true,
      data: userInSystem,
      token,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error('Invalid credentials');
  }
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    data: 'User logged out',
  });
});

module.exports = {
  register,
  login,
  logout,
};
