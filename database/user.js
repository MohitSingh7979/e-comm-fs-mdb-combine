const { createTodoList } = require("./todo.js");
const uuid = require("uuid").v4;

const User = { collection: null };

async function getUser(id) {
  try {
    const user = await User.collection.findOne({ id });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
}
User.getUser = getUser;

async function saveUser(id, name, password) {
  try {
    const user = { id, name, password, todoId: uuid() };

    await createTodoList(user.todoId);
    await User.collection.insertOne(user);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
User.saveUser = saveUser;

module.exports = User;
