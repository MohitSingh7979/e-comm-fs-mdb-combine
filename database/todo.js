const ObjectId = require("mongodb").ObjectId;
const Todo = { collection: null };
const uuid = require("uuid").v4;

async function getTodoList(id) {
  try {
    const todoList = await Todo.collection.findOne({ _id: new ObjectId(id) }, {
      projection: { _id: 0 },
    });
    return todoList;
  } catch (err) {
    console.log(err);
    return null;
  }
}
Todo.getTodoList = getTodoList;

async function createTodoList() {
  try {
    const res = await Todo.collection.insertOne({});
    return res.insertedId.toString();
  } catch (err) {
    console.log(err);
    return null;
  }
}
Todo.createTodoList = createTodoList;

async function saveTaskToList(id, info, imagePath, completed, taskId) {
  try {
    const task = { info, id: taskId || uuid(), completed, imagePath };
    await Todo.collection.updateOne({ _id: new ObjectId(id) }, {
      $set: { [task.id]: task },
    });
    return task.id;
  } catch (err) {
    console.log(err);
  }
}
Todo.saveTaskToList = saveTaskToList;

async function removeTaskFromList(id, taskId) {
  try {
    await Todo.collection.updateOne({ _id: new ObjectId(id) }, {
      $unset: { [taskId]: "" },
    });
  } catch (err) {
    console.log(err);
  }
}
Todo.removeTaskFromList = removeTaskFromList;

async function getTaskFromList(id, taskId) {
  try {
    const list = await Todo.collection.findOne({ _id: new ObjectId(id) }, {
      [taskId]: 1,
    });
    return list[taskId];
  } catch (err) {
    console.log(err);
    return null;
  }
}
Todo.getTaskFromList = getTaskFromList;

module.exports = Todo;
