const jwt = require("jsonwebtoken");

let checktoken = (req, res, next) => {
  let header = req.header("Authorization");
  let token;
  let user;

  if (header === "undefined") {
    console.log("Header is undefined");
  }
  if (header !== "undefined") {
    user = JSON.parse(decodeURIComponent(header));
    token = user.token;
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          message: "Token is not valid"
        });
        // next();
      } else {
        next();
      }
    });
  } else {
    res.json({
      success: false,
      message: "There is no Token"
    });
  }
};

module.exports = checktoken;
