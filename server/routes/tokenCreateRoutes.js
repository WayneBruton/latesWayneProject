const jwt = require("jsonwebtoken");

function jwtSignUser(user) {
  const ONE_DAY = 60 * 60 * 24 * 3;
  // const ONE_DAY = 30 * 1;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: ONE_DAY
  });
}

module.exports = jwtSignUser;
