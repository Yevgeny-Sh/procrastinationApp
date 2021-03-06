const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const keys = require("../config/keys");

// //!the auth tokens are sent in the header
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, keys.SECRET_FOR_AUTH);
    //decoded now contains object with user _id
    //the second arg is a string called - "secret"
    //stored as a env variable, hidden in the config folder
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
