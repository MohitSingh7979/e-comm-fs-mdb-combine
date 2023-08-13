const Todo = { collection: null };
const uuid = require("uuid").v4;

async function getTodoList(id) {
  try {
    const todoList = await Todo.collection.findOne({ id }, {_id: 0, id: 0});
    delete todoList._id;
    delete todoList.id;
    return todoList;
  } catch (err) {
    console.log(err);
    return null;
  }
}
Todo.getTodoList = getTodoList;

async function createTodoList(id) {
  try {
    await Todo.collection.insertOne({ id });
  } catch (err) {
    console.log(err);
    return null;
  }
}
Todo.createTodoList = createTodoList;

async function saveTaskToList(id, info, imagePath, completed, taskId) {
  try {
    const task = { info, id: taskId || uuid(), completed, imagePath };
    await Todo.collection.updateOne({ id }, { $set: { [taskId]: task } });
  } catch (err) {
    console.log(err);
  }
}
Todo.saveTaskToList = saveTaskToList;

async function removeTaskFromList(id, taskId) {
  try {
    await Todo.collection.updateOne({ id }, { $unset: { [taskId]: "" } });
  } catch (err) {
    console.log(err);
  }
}
Todo.removeTaskFromList = removeTaskFromList;

async function getTaskFromList(id, taskId) {
  try {
    const list = await Todo.collection.findOne({ id }, {[taskId]:1});
    console.log(list);
    return list[taskId];
  } catch (err) {
    console.log(err);
    return null;
  }

}
Todo.getTaskFromList = getTaskFromList;

module.exports = Todo;
