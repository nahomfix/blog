const { body } = require('express-validator');
const User = require('../models/user.model');

const validations = {
  register: [
    body('name').not().isEmpty().trim().escape(),
    body('email')
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('email already in use');
          }
        });
      }),
    body('password')
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isLength({ min: 6 })
      .withMessage('must be at least 6 characters long'),
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject('user not found');
          }
        });
      }),
    body('password').not().isEmpty().trim().escape(),
  ],
};

module.exports = validations;
