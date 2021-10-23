var db = require("../config/connection");
const { response } = require("express");
var objectId = require("mongodb").ObjectID;
const { ObjectID } = require("mongodb");
module.exports = {
  signUp: (users) => {
    return new Promise(async (resolve, reject) => {
      console.log(users.UserName + "usernM");

      usernew = await db
        .get()
        .collection("users")
        .findOne({ UserName: users.UserName });

      if (!usernew) {
        db.get()
          .collection("users")
          .insertOne(users)
          .then((response) => {
            resolve(response);
          });
      } else {
        response.Userexist = true;
        resolve({ Userexist: true });
      }
    });
  },

  doLogin: (usersdata) => {
    return new Promise(async (resolve, reject) => {
      let loginstatus = false;
      let response = {};
      let pw = [];
      let user = await db
        .get()
        .collection("users")
        .findOne({ UserName: usersdata.UserName });

      if (user) {
        console.log("Username success" + user.pw);
        if (usersdata.pw == user.pw) {
          console.log("Username and pw success" + user.pw);
          loginstatus = true;
          response.user = user;
          response.status = true;

          resolve(response);
        } else {
          console.log("login failed pw error");

          resolve({ status: false });
        }
      } else {
        console.log("username error");

        resolve({ status: false });
      }
      return loginstatus;
    });
  },
  doAdminLogin: (usersdata) => {
    return new Promise(async (resolve, reject) => {
      let loginstatus = false;
      let response = {};

      let admin = await db
        .get()
        .collection("admin")
        .findOne({ adminName: usersdata.adminName });
      if (admin) {
        console.log("Username success" + admin.adminPw);
        if (usersdata.adminPw == admin.adminPw) {
          console.log("Username and pw success" + admin.adminPw);
          loginstatus = true;
          response.admin = admin;
          response.status = true;

          resolve(response);
        } else {
          console.log("login failed pw error");

          resolve({ status: false });
        }
      } else {
        console.log("username error");

        resolve({ status: false });
      }
      return loginstatus;
    });
  },
  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db.get().collection("users").find().toArray();
      resolve(users);
    });
  },
  adduser: (userData) => {
    return new Promise(async (resolve, reject) => {
      let userExist = await db
        .get()
        .collection("users")
        .findOne({ UserName: userData.UserName });
      if (!userExist) {
        db.get()
          .collection("users")
          .insertOne(userData)
          .then((data) => {
            resolve(data);
          });
      } else {
        reject();
      }
      console.log(userData);
    });
  },
  getUserDetails: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection("users")
        .findOne({ _id: ObjectID(userId) })
        .then((user) => {
          resolve(user);
        });
    });
  },

  updateUser: (userId, userDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection("users")
        .updateOne(
          { _id: ObjectID(userId) },
          {
            $set: {
              UserName: userDetails.UserName,
              pw: userDetails.pw,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  deleteUser: (userid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection("users")
        .remove({ _id: ObjectID(userid) })
        .then((response) => {
          resolve(response);
        });
    });
  },
};
