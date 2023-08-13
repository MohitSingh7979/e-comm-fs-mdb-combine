const { MongoClient } = require("mongodb");
const User = require("./user");
const Todo = require("./todo");
const MONGO_URL = require("../config").MONGO_URL;

async function init() {
  const client = new MongoClient(MONGO_URL);
  const connection = await client.connect();
  const db = connection.db("summerTraining"); 
  User.collection = db.collection("users");
  Todo.collection = db.collection("todos");
}

module.exports = {
  init,
  User,
  Todo,
};
