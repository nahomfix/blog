const jwt = require('jsonwebtoken');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const checkToken = (req, res, next) => {
  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(StatusCodes.FORBIDDEN);
      throw new Error(ReasonPhrases.FORBIDDEN);
    } else if (payload) {
      req.user = payload;
      next();
    }
  });
};

module.exports = checkToken;
