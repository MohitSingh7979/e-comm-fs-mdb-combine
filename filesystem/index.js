const User = require("./user");
const Todo = require("./todo");

async function init(){
  await User.init();
  await Todo.init();
}

module.exports = {
  init,
  User,
  Todo
};
