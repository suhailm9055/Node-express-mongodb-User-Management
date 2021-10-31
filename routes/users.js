var express = require("express");

var router = express.Router();
var mongoClient = require("mongodb").MongoClient;
const { response } = require("express");

var signOut = false;
var logsuccess = false;
var Userexisterr = false;
var cpwerr =false

var dbhelp = require("../DBhelper/signuphelper");
/* GET home page. */
router.get("/", verifyLogin, function (req, res, next) {
  user = req.session.userid;
  var urlf = req.url
  var url = urlf.split("=");
  var url1 = url[1];
  var passchangeseccess=req.session.pwchsuccess
  console.log(passchangeseccess+"passchangeseccess");
  res.render("homepage", { user, logsuccess ,url1,passchangeseccess });
  logsuccess = false;
});

function verifyLogin(req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  if (req.session.loggedIn || req.session.signupedin) {
    next();
  } else {
    res.redirect("/login");
  }
}
// pass change post
// router.post("/?variable=pwch:user",verifyLogin,(req,res,next)=>{
//   dbhelp.pwch(req.body).then((response) => {
//     if(response.status){
//      req.session.pwchsuccess=true
// res.redirect("/");
//     }else{
//     req.session.pwchsuccess=false
// res.redirect("/");
//     }
// })

// });
/* post login page. */
router.post("/submit", formVarify, function (req, res, next) {
  logsuccess = true;
  console.log("token approved");
  res.redirect("/");
});
function formVarify(req, res, next) {
 
  dbhelp.doLogin(req.body).then((response) => {
    console.log(response.status + "status error");
    if (response.status) {
      req.session.loggedIn = true;
      req.session.userid = req.body.UserName;
      next();
    } else {
      console.log("token not approved");
      req.session.loginErr = true;
      res.redirect("/login");
    }
  });
}

/* Get login page. */
router.get("/login", varifyuser, function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  res.render("loginpage", {
    LoginErr: req.session.loginErr,
    logout: signOut,
  });
  console.log("loginerrorbfor" + req.session.loginErr);
  req.session.loginErr = false;
  console.log("loginerrorafter" + req.session.loginErr);
  signOut = false;
  console.log(req.session.signupedin + "req.session.signupedin");
});

function varifyuser(req, res, next) {
  if (!req.session.loggedIn && !req.session.signupedin) {
    next();
  } else {
    res.redirect("/");
  }
}

/* get signup page. */
router.get("/signuppage", varifyuser, (req, res, next) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
 var pwerr1=req.session.cpwerr
  console.log(pwerr1+ "cpwerr");
  res.render("signuppage", { Userexisterr ,pwerr1});
  Userexisterr = false;
  req.session.cpwerr=false;
});

/*POST signup page. */
router.post("/signup", (req, res, next) => {
  req.session.userid = req.body.UserName;
 console.log(req.body.pw);
 console.log(req.body.cpw);
  if (req.body.pw===req.body.cpw){

    dbhelp.signUp(req.body).then((response) => {
      if (response.Userexist) {
        Userexisterr = response.Userexist;
  
        res.redirect("/signuppage");
      } else {
        req.session.signupedin = true;
        res.redirect("/");
      }
    });
    }else{
      cpwerr=true
      req.session.cpwerr=cpwerr
      
      res.redirect("/signuppage");
    }
    
  

});

/* get logout page. */
router.get("/logout", function (req, res, next) {
  req.session.loggedIn = false;
  req.session.signupedin = false;
  signOut = true;
  res.redirect("/login");
});

// /* get list page. */
// router.get("/list", verifyLogin, function (req, res, next) {
//   const persons = {
//     firstName: "John",
//     lastName: "Doe",
//     age: 50,
//     eyeColor: "blue",
//   };
//   res.render("list", { persons, user });
// });

// /* get card page. */
// router.get("/card", verifyLogin, function (req, res, next) {
//   const personsarr = {
//     person1: {
//       img: "/images/batman.jpg",
//       name: "Dark Knigth",
//       sname: "Batman",
//       year: 2008,
//       color: "black",
//     },
//     person2: {
//       img: "/images/inception.jpg",
//       name: "Chris",
//       sname: "Nolan",
//       year: 2010,
//       color: "red",
//     },
//     person3: {
//       img: "/images/tenet.jpg",
//       name: "Tenet",
//       sname: "Doe",
//       year: 2020,
//       color: "blue",
//     },
//   };

//   res.render("card", { personsarr, user });
// });
// /* get table page. */
// router.get("/table", verifyLogin, function (req, res, next) {
//   const personsarr = [
//     {
//       firstName: "Dark Knight",
//       lastName: "Batman",
//       age: 2008,
//       eyeColor: "black",
//     },
//     { firstName: "Chris", lastName: "Nolan", age: 2010, eyeColor: "red" },
//     { firstName: "Tenet", lastName: "Doe", age: 2020, eyeColor: "green" },
//   ];

//   res.render("table", { personsarr, user });
// });


module.exports = router;

