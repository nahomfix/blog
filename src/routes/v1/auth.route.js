const {
  register,
  login,
  logout,
  generateToken,
  changePassword,
} = require('../../controllers/auth.controller');
const router = require('express').Router();
const validations = require('../../utils/validations');
const checkToken = require('../../middlewares/auth.middleware');

router.post('/register', validations.register, register);
router.post('/login', validations.login, login);
router.get('/logout', logout);
router.get('/generateToken', generateToken);
router.post(
  '/changePassword',
  checkToken,
  validations.changePassword,
  changePassword
);

module.exports = router;
