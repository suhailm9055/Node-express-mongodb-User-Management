var db = require("../config/connection");
const { ObjectID } = require("mongodb");
module.exports = {
  signUp: (users) => {
    return new Promise(async (resolve, reject) => {
      console.log(users.UserName + "usernM");
      
      let response={err:{msg:"", status:false}}
      
      usernew = await db
        .get()
        .collection("users")
        .findOne({ UserName: users.UserName }).then((user)=>{


          
        })

      if (!usernew) {
        
        // users.bstatus=true;
        
        // users.loggedin=true;
        await db.get()
          .collection("users")
          .insertOne(users)
            await db.get()
            .collection("users")
            .updateOne(
              { UserName: users.UserName },
              {
                $set: {
                  bstatus: true,
                  loggedin:true
                },
              }
            );
         await db.get()
            .collection("users")
            .updateOne(
              { UserName: users.UserName },
              {
                $unset: {
                  cpw: 1,
                },
              }
            )
            .then((response) => {
              
              let user=db.get().collection("users").findOne({UserName: users.UserName});
              resolve(user);
            });
          
       
      } else {
        response.err.status=true
                response.err.msg="User already exists"
                resolve(response)
      
      }
    });
  },
  chechstatus: (users) => {
    console.log(users);
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection("users")
        .findOne({}, { UserName: users.UserName })
        .then((response) => {
          resolve(response);
        });
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
        response.user = user;
        console.log("Username success" + user.pw);
        if (user.bstatus === true) {
          if (usersdata.pw == user.pw) {
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("login failed pw error");
            response.status = false;
            response.err="login error"
            resolve(response);
          }
        } else {
          response.bstatus = false;
          response.err="User Blocked"
          resolve(response);
        }
      } else {
        console.log("username error");
        response.status = false;
        response.err='No user Found'
        resolve(response);
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
              email: userDetails.email,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection("users")
        .remove({ _id: ObjectID(id) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  blockUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection("users")
        .updateOne({ _id: ObjectID(userId) }, { $set: { bstatus: false } })
        .then((response) => {
          console.log(response + "block res");
          resolve(response);
        });
    });
  },
  unblockUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection("users")
        .updateOne({ _id: ObjectID(userId) }, { $set: { bstatus: true } })
        .then((response) => {
          console.log(response + "block res");
          resolve(response);
        });
    });
  },
  logout: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection("users")
        .updateOne({ _id: ObjectID(userId) }, { $set: { loggedin:false } })
        .then((response) => {
          console.log(response + "block res");
          resolve(response);
        });
    });
  },
};
