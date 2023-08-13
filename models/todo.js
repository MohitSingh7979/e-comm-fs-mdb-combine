const fs = require("fs").promises;
const {
  UPLOADS_DIR,
  STORE_MOD_DIR,
} = require("../config");
const todoStore = require(STORE_MOD_DIR).Todo; 

const User = require("./user");

class Task {
  constructor(info, imagePath, id = null, completed = false) {
    this.info = info;
    this.imagePath = imagePath;
    this.completed = completed;
    this.id = id;
    this.isAuthentic = false;
  }

  validateInfo() {
    return true;
  }

  async syncInfo() {
    const task = await Todo.getTask(this.id);
    this.isAuthentic = !!task;
    if (this.isAuthentic) {
      this.info = task.info;
      this.completed = task.completed;
      this.imagePath = task.imagePath;
    }
  }

  async toggleStatus() {
    if (this.isAuthentic) {
      this.completed = !this.completed;
      await Todo.addTask(this);
    } else {
      console.log("first sync task info");
    }
  }
}

class Todo {
  static req = null;

  static middleware(req, res, next) {
    Todo.req = req;
    next();
  }

  static getTodoId() {
    const user = User.getCurrentUser();
    return user.todoId;
  }

  static async getList() {
    const id = Todo.getTodoId();
    try {
      const list = await todoStore.getTodoList(id);
      return list;
    } catch (err) {
      console.log("failed to get todolist");
      return null;
    }
  }

  static async addTask(task) {
    const id = Todo.getTodoId();
    try {
      const { id: taskId, info, completed, imagePath } = task;
      const fetchedId = await todoStore.saveTaskToList(id, info, imagePath, completed, taskId);
      task.id = fetchedId;
    } catch (err) {
      console.log("failed to save todolist");
    }
  }

  static async removeTask(task) {
    const id = Todo.getTodoId();
    try {
      await todoStore.removeTaskFromList(id, task.id);
      await fs.rm(path.join(UPLOADS_DIR, task.imagePath));
    } catch (err) {
      console.log("failed to remove task");
    }
  }

  static async getTask(taskId) {
    const id = Todo.getTodoId();
    try {
      const { info, imagePath, completed } = await todoStore.getTaskFromList(
        id,
        taskId,
      );
      const task = new Task(info, imagePath, taskId, completed);
      return task;
    } catch (err) {
      console.log("failed to get Task");
    }
  }
}

module.exports = {
  Task,
  Todo,
};
