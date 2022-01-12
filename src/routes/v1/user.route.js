const {
  register,
  login,
  logout,
} = require('../../controllers/user.controller');
const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
