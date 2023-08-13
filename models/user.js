const STORE_MOD_DIR = require("../config").STORE_MOD_DIR;
const userStore = require(STORE_MOD_DIR).User; 
// const {
//   email: validateEmail,
//   password: validatePassword
// } = require("./utils/validator");

class User {
  static req = null;
  static middleware(req, res, next) {
    User.req = req;
    next();
  }

  static isLoggedIn() {
    return !!User.getCurrentUser();
  }

  static getCurrentUser() {
    return User.req.session.currentUser;
  }

  static logout() {
    User.req.session.currentUser = null;
  }

  static async login(user) {
    User.req.session.currentUser = user;
  }

  constructor(id, password, name = "", todoId = null) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.todoId = null;
    this.isAuthentic = false;
    this.isRegistred = false;
  }

  validateInfo() {
    return true;
    // return validateEmail(this.email) &&
    //   validatePassword(this.password);
  }

  async syncInfo() {
    const user = await userStore.getUser(this.id);
    if (!user) {
      console.log("failed to fetch user from store...");
    } else {
      this.isRegistred = !!user;
      if (this.isRegistred){
        this.name = user.name;
        this.todoId = user.todoId;
      }
      this.isAuthentic = this.isRegistred && this.password == user.password;
    }
  }

  async save() {
    const { id, name, password } = this;
    await userStore.saveUser(id, name, password);
  }
}

module.exports = User;
