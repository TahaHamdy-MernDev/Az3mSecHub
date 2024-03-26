const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
  return token;
};

module.exports = { generateTokenAndSetCookie };
