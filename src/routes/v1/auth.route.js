const {
  register,
  login,
  logout,
  generateToken,
} = require('../../controllers/auth.controller');
const router = require('express').Router();
const validations = require('../../utils/validations');

router.post('/register', validations.register, register);
router.post('/login', validations.login, login);
router.get('/logout', logout);
router.get('/generateToken', generateToken);

module.exports = router;
