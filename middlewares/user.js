const User = require("../models/user");

function warnIfLogged(req, res, next) {
  if (User.isLoggedIn()) {
    res
      .status(403)
      .send({
        errors: ["User is already logged in."],
        status: "",
      });
  } else {
    next();
  }
}

function warnIfNotLogged(req, res, next) {
  if (!User.isLoggedIn()) {
    res
      .status(404)
      .send({
        user: null,
        isLogged: false,
        errors: ["User is not logged in."],
        status: "",
      });
  } else {
    next();
  }
}

function redirectIfNotLogged(req, res, next) {
  if (req.url != "/login" && !User.isLoggedIn()) {
    res.redirect("/login");
  } else {
    next();
  }
}

function redirectIfLogged(req, res, next){
  if(req.url != "/home" && User.isLoggedIn()){
    res.redirect("/home");
  }
  next();
}

module.exports = {
  warnIfLogged,
  warnIfNotLogged,
  redirectIfLogged,
  redirectIfNotLogged,
};
