const express = require("express");
const multer = require("multer");
const path = require("path");
const { Todo, Task } = require("../models/todo");
const {
  warnIfNotLogged,
} = require("../middlewares/user");
const User = require("../models/user");

const UPLOADS_DIR = require("../config").UPLOADS_DIR;

const todoRouter = express.Router();

todoRouter.use(User.middleware);
todoRouter.use(Todo.middleware);
todoRouter.use(warnIfNotLogged);

const multerMiddleware = multer({ dest: UPLOADS_DIR });

todoRouter.get("/", async (req, res) => {
  const list = await Todo.getList();
  res
    .send({
      list,
      errors: [],
      status: "list loaded successfully",
    });
});

todoRouter.post("/", multerMiddleware.single("image"), async (req, res) => {
  const { info } = req.body;
  const file = req.file;

  const task = new Task(info, file?.filename);
  if (!task.validateInfo()) {
    res
      .send({
        task,
        errors: ["Unable to create task.."],
        status: "",
      });
  } else {
    await Todo.addTask(task);
    res
      .send({
        task,
        errors: [],
        status: "task added successfully..",
      });
  }
});

// toggle status
todoRouter.post("/task/:id", async (req, res) => {
  const taskId = req.params.id;

  const task = new Task("", "", taskId);
  await task.syncInfo();
  if (!task.validateInfo()) {
    res
      .send({
        task: null,
        errors: ["No such task.."],
        status: "",
      });
  } else {
    await task.toggleStatus();
    res
      .send({
        task,
        errors: [],
        status: `task status changed to ${task.completed ? "completed" : "not completed"}`,
      });
  }
});

// deleteTask
todoRouter.delete("/task/:id", async (req, res) => {
  const taskId = req.params.id;

  const task = new Task("", "", taskId);
  await task.syncInfo();
  if (!task.validateInfo()) {
    res
      .send({
        task: null,
        errors: ["No such task.."],
        status: "",
      });
  } else {
    await Todo.removeTask(task);
    res
      .send({
        task,
        errors: [],
        status: "task deleted successfully..",
      });
  }
});

module.exports = todoRouter;
