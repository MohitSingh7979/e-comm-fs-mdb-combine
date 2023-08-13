const { readFile, stat, writeFile, rm } = require("fs").promises;
const path = require("path");
const { v4: uuid } = require("uuid");

const FILE = path.join(__dirname, "todo.json");
//
// {
//   "todolist_id": "{
//    "task_id": "{task, progress, id}",
//    "task_id_2"....
//   }"
// }

async function init() {
  try {
    await stat(FILE, { encoding: "utf-8" });
  } catch (err) {
    await writeFile(FILE, "{}", { encoding: "utf-8" });
  }
}

async function getTodoList(id) {
  try {
    const data = await readFile(FILE, { encoding: "utf-8" });
    const todoLists = JSON.parse(data || "{}");
    if (!(id in todoLists)) {
      todoLists[id] = "{}";
    }
    const userTodolist = JSON.parse(todoLists[id]);
    return userTodolist;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function saveTodoList(id, userTodolist) {
  try {
    const data = await readFile(FILE, { encoding: "utf-8" });
    const todoLists = JSON.parse(data || "{}");
    todoLists[id] = JSON.stringify(userTodolist);
    await writeFile(FILE, JSON.stringify(todoLists));
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function saveTaskToList(id, info, imagePath, completed, taskId) {
  const todolist = await getTodoList(id);
  const task = { info, id: taskId || uuid(), completed, imagePath };
  todolist[task.id] = task;
  await saveTodoList(id, todolist);
  return task.id;
}

async function removeTaskFromList(id, taskId){
  const todolist = await getTodoList(id);
  delete todolist[taskId];
  await saveTodoList(id, todolist);
}

async function getTaskFromList(id, taskId){
  const todolist = await getTodoList(id);
  const task = todolist[taskId];
  return task;
}

module.exports = {
  saveTodoList,
  getTodoList,
  saveTaskToList,
  removeTaskFromList,
  getTaskFromList,
  init,
};
