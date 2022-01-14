const User = require('../models/user.model');
const argon2 = require('argon2');
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      status: StatusCodes.BAD_REQUEST,
      errors: errors.array(),
    });
  }

  const { name, email, password } = req.body;
  const hashedPassword = await argon2.hash(password);

  try {
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    throw error;
  }
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      status: StatusCodes.BAD_REQUEST,
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;
  const userInSystem = await User.findOne({ email });
  const passwordMatches = await argon2.verify(userInSystem.password, password);

  if (passwordMatches) {
    const token = jwt.sign(
      { id: userInSystem._id, email: userInSystem.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '10s',
      }
    );
    const refreshToken = jwt.sign(
      { id: userInSystem._id, email: userInSystem.email },
      process.env.REFRESH_JWT_SECRET,
      {
        expiresIn: '1m',
      }
    );

    userInSystem.refreshToken = refreshToken;
    await userInSystem.save();

    res.cookie('token', token, { maxAge: 900000, httpOnly: true });
    res.cookie('refreshToken', userInSystem.refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });
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
  try {
    const { refreshToken } = req.cookies;
    const user = await User.findOne({ refreshToken });
    user.refreshToken = '';
    await user.save();
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({
      success: true,
      data: 'User logged out',
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    throw error;
  }
});

const generateToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(StatusCodes.FORBIDDEN);
    throw new Error('Access denied, token missing');
  } else {
    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error('Token expired');
    } else {
      jwt.verify(
        user.refreshToken,
        process.env.REFRESH_JWT_SECRET,
        (err, payload) => {
          if (err) {
            res.status(StatusCodes.UNAUTHORIZED);
            throw err;
          } else {
            const accessToken = jwt.sign(
              { id: payload.id, email: payload.email },
              process.env.JWT_SECRET,
              {
                expiresIn: '10s',
              }
            );
            res.cookie('token', accessToken, {
              maxAge: 900000,
              httpOnly: true,
            });

            return res.status(StatusCodes.OK).json({ accessToken });
          }
        }
      );
    }
  }
});

module.exports = {
  register,
  login,
  logout,
  generateToken,
};
