const jwt = require('jsonwebtoken');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const checkToken = (req, res, next) => {
  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error(ReasonPhrases.UNAUTHORIZED);
    } else if (payload.id) {
      req.user = payload;
      next();
    }
  });
};

module.exports = checkToken;
