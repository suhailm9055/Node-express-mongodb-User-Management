var express = require("express");
var router = express.Router();
var signOut = false;
var logsuccess = false;
var Userexisterr = false;
var cpwerr = false;

const { ObjectId } = require("mongodb");
var dbhelp = require("../DBhelper/signuphelper");


// Verify login middleware
async function verifyLogin(req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");

    if(req.session.loggedIn) {
      
        
          next()
        
    
}
else res.redirect("/login")
}
/* GET home page. */
router.get("/", verifyLogin, function (req, res, next) {
  user = req.session.userid;
  
  res.render("homepage", { user, logsuccess});
  logsuccess = false;
  req.session.signupedin=false
});


/* post login page. */
router.post("/login",  function (req, res, next) {
  console.log("imhere");
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  logsuccess = true;
  
 console.log( req.sessionID+"user sid");
  
  dbhelp.doLogin(req.body).then((response) => {
    console.log("thenhere")
  if(response.status){
    console.log("then here" + response.user)
    req.session.user = response.user
    req.session.loggedIn = true;
    req.session.userid = req.body.UserName
    req.session.bstatus=response.user.bstatus
    res.redirect("/");
  } else {
    res.render("loginpage", {err:response.err})
  }
 
  })
  
});


/* Get login page. */
router.get("/login", function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("loginpage")
  }  
});


/* get signup page. */
router.get("/signuppage", (req, res, next) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  if (!req.session.loggedIn && !req.session.signupedin) {
    cperr=req.session.cpwerr
    res.render("signuppage", { Userexisterr,cperr});
    Userexisterr = false;
    req.session.cpwerr=false;
  } else {
    res.redirect("/");
  }
 
});

/*POST signup page. */
router.post("/signup", (req, res, next) => {
 
  if (req.body.pw === req.body.cpw) {
    dbhelp.signUp(req.body).then((response) => {
      if (!response?.err?.status) {
        req.session.userid=response
        req.session.loggedIn = true;
        
        req.session.signupedin=true
        res.redirect("/login");
      } else {
        
      res.render("users/signup", {err:response.err})
      }
    });
  } else {
    cpwerr = true;
    req.session.cpwerr = cpwerr;

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



module.exports = router;
