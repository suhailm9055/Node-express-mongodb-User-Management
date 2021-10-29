var express = require("express");
var router = express.Router();
const { response } = require("express");
var dbhelp = require("../DBhelper/signuphelper");

var adminsignOut = false;
var adminlogsuccess = false;
var updateuser = false;
/* GET home page. */
router.get("/", verifyLogin, function (req, res, next) {
  admin = req.session.adminid;
  res.render("admin/Homepage", { admin, adminlogsuccess });
  adminlogsuccess = false;
});
function verifyLogin(req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  console.log("adminHome varify started");
  if (req.session.adminloggedIn) {
    console.log("adminHome varify success");
    next();
  } else {
    console.log("adminHome varify failed.    ()=> redirect to admin login");
    res.redirect("/admin/adminlogin");
  }
}

/* Get Admin login page. */
router.get("/adminlogin", function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  console.log("admin login page started");

  console.log("admin login page completed");

  if (!req.session.adminloggedIn) {
    console.log("not logged in  already");
    res.render("admin/login", {
      adminLoginErr: req.session.adminloginErr,
      adminlogout: adminsignOut,
    });
    req.session.adminloginErr = false;
    adminsignOut = false;
  } else {
    console.log("already logged");
    res.redirect("/admin");
  }
});
function adminVarify(req, res, next) {
  dbhelp.doAdminLogin(req.body).then((response) => {
    console.log(response.status + "status error");
    if (response.status) {
      req.session.adminloggedIn = true;
      req.session.adminid = req.body.adminName;
      next();
    } else {
      console.log("admin token not approved");
      req.session.adminloginErr = true;
      res.redirect("/admin");
    }
  });
}
/* post login page. */
router.post("/adminsubmit", adminVarify, function (req, res, next) {
  adminlogsuccess = true;
  console.log("admin token approved");
  res.redirect("/admin");
});
function formVarify(req, res, next) {
  console.log("form varify started");
  for (i = 0; i < adminuserName.length; i++) {
    if (
      req.body.adminUserName === adminuserName[i] &&
      req.body.adminpw === adminpassword[i]
    ) {
      req.session.adminloggedIn = true;
    }
  }
  if (req.session.adminloggedIn) {
    req.session.adminid = req.body.adminUserName;
    next();
  } else {
    console.log("token not approved");
    req.session.adminloginErr = true;
    res.redirect("/admin/adminlogin");
  }
}

/* get logout page. */
router.get("/logout", function (req, res, next) {
  req.session.adminloggedIn = false;
  adminsignOut = true;
  res.redirect("/admin/adminlogin");
});

/* get list page. */
router.get("/users", verifyLogin, function (req, res, next) {
  dbhelp.getAllUsers().then((users) => {
    updateuser = req.session.usernameup;
    res.render("admin/table", { users, updateuser });
  });
  updateuser = false;
});
router.get("/updateuser/:id", verifyLogin, async (req, res) => {
  let userData = await dbhelp.getUserDetails(req.params.id);
  console.log(userData);
  res.render("admin/update", { userData });
});

router.post("/updateuser/:id", verifyLogin, function (req, res, next) {
  dbhelp.updateUser(req.params.id, req.body).then(() => {
    res.redirect("/admin/users");
  });
});

router.get("/adduser", verifyLogin, function (req, res, next) {
  res.render("admin/adduser");
});

router.post("/adduser", verifyLogin, function (req, res, next) {
  dbhelp
    .adduser(req.body)
    .then((response) => {
      console.log(response);
      res.redirect("/admin/users");
    })
    .catch(() => {
      req.session.userExist = true;
      res.redirect("/admin/adduser");
    });
});
router.get("/deleteuser/:id", (req, res, next) => {
  let userId = req.params.id;
  console.log(userId + "user id delete");
  dbhelp.deleteUser(userId).then((response) => {
    res.redirect("/admin/users");
  });
});


module.exports = router;
