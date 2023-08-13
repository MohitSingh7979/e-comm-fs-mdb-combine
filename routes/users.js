const express = require("express");
const multer = require("multer");

const User = require("../models/user");
const {
  warnIfLogged,
  warnIfNotLogged,
} = require("../middlewares/user");

const userRouter = express.Router();

userRouter.use(User.middleware);

userRouter.use(multer().any());

userRouter.post("/", warnIfLogged, async (req, res) => {
  const { email: id, password } = req.body;
  const user = new User(id, password);
  await user.syncInfo();
  if (!user.isRegistred) {
    res.status(404).send({
      errors: ["User not found."],
      status: "",
    });
  } else if (!user.isAuthentic) {
    res.status(403).send({
      errors: ["Wrong password"],
      status: "",
    });
  } else {
    User.login(user);
    res.send({
      errors: [],
      status: "User logged in successfully",
    });
  }
});

userRouter.post("/create", warnIfLogged, async (req, res) => {
  const { email: id, name, password } = req.body;
  const user = new User(id, password, name);
  await user.syncInfo();
  if (user.isRegistred) {
    res.status(403).send({
      errors: ["You're already registered"],
      status: "",
    });
  } else {
    if (!user.validateInfo()) {
      res.send({
        errors: ["invalid details"],
        status: "",
      });
    } else {
      await user.save();
      res.send({
        errors: [],
        status: "you're registered successfully",
      });
    }
  }
});

userRouter.get("/", warnIfNotLogged, (req, res) => {
  const user = User.getCurrentUser();
  res
    .send({
      user: user.name,
      isLogged: true,
      errors: [],
      status: "",
    });
});

userRouter.delete("/", warnIfNotLogged, (req, res) => {
  User.logout();
  res.send({
    errors: [],
    status: "User logout successfully.",
  });
});

module.exports = userRouter;
