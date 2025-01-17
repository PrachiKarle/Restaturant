var express = require("express");
const router = express.Router();

const sendOTP = require("../Email");
var exe = require("../connection");

const sendBooking = require("../Email1");




// home page
router.get("/", async (req, res) => {
  //services
  var sql1 = `select* from service`;
  var d1 = await exe(sql1);

  //team members
  var sql2 = `select* from team`;
  var d2 = await exe(sql2);

  var name = "User";
  if (req.session.login_user_name) {
    name = req.session.login_user_name;
  }

  const obj = { data: d1, data1: d2, usernm: name };
  res.render("index.ejs", obj);
});






//booking
router.post("/booktable", async (req, res) => {
  if (req.session.user_id) {
    const {
      booking_name,
      booking_email,
      booking_date,
      booking_time,
      booking_no,
    } = req.body;

    var sql = `insert into booking(user_id,name,email,booking_date,booking_time,no) values(?,?,?,?,?,?)`;

    var values = [
      req.session.user_id,
      booking_name,
      booking_email,
      booking_date,
      booking_time,
      booking_no,
    ];
    await exe(sql, values);

    sendBooking(values);
    res.redirect("/");
  } else {
    res.redirect("/sign");
  }
});






//contact
router.post("/savecontact", async (req, res) => {
  if (req.session.user_id) {
    const { name, email, subject, msg } = req.body;
    var sql = `insert into contact(user_id,Name,Email,Subject,Message) values(?,?,?,?,?)`;

    var values = [req.session.user_id, name, email, subject, msg];
    await exe(sql, values);
    res.redirect("/");
  } else {
    res.redirect("/sign");
  }
});






//menu
router.get("/menu", async (req, res) => {
  var name = "User";
  if (req.session.login_user_name) {
    name = req.session.login_user_name;
  }
  // starter menu
  var sql1 = `select* from starter limit 6`;
  var d1 = await exe(sql1);

  //main menu
  var sql2 = `select* from mainmenu limit 6`;
  var d2 = await exe(sql2);

  //desserts
  var sql3 = `select* from desserts limit 6`;
  var d3 = await exe(sql3);

  const obj = { usernm: name, starter: d1, mainmenu: d2, desserts: d3 };
  res.render("user/menu.ejs", obj);
});







//sign in
router.get("/sign", (req, res) => {
  res.render("user/sign.ejs");
});
router.post("/loginuser", async (req, res) => {
  const { user_email, user_pass } = req.body;
  var sql = `select* from user where user_email=? AND user_pass=?`;
  var data = await exe(sql, [user_email, user_pass]);
  // res.send(data);
  if (data.length > 0) {
    req.session.user_loginId = data[0].Id;
    req.session.user_name = data[0].user_name;

    var otp = Math.trunc(Math.random() * 10000);
    sendOTP(user_email, data[0].user_name, otp);

    req.session.user_otp = otp;
    res.redirect('/accept_otp');
  } else {
    res.redirect("/sign");
  }
});
router.get('/accept_otp', (req, res) => {
  if (req.session.user_loginId) {
    res.render("user/acceptOtp.ejs");
  } else {
    res.redirect("/sign");
  }
});
router.post("/verifyotp", (req, res) => {
  if (req.body.user_otp == req.session.user_otp) {
    req.session.user_id = req.session.user_loginId;
    req.session.login_user_name = req.session.user_name;

    res.redirect('/');
  } else {
    res.redirect("/accept_otp");
  }
});




//sign up
router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});
router.post("/adduser", async (req, res) => {
  const { user_name, user_email, user_pass } = req.body;
  var sql = `insert into user(user_name,user_email,user_pass) values(?,?,?)`;
  await exe(sql, [user_name, user_email, user_pass]);
  res.redirect("/sign");
});





// user Profile
router.get("/userprofile", async (req, res) => {
  if (req.session.user_id) {
    var sql = `select* from booking where user_id=?`;
    var d1 = await exe(sql,[req.session.user_id]);

    var sql = `select* from contact where user_id= ?`;
    var d2 = await exe(sql,[req.session.user_id]);

    const obj={data1:d1,data2:d2,usernm:req.session.login_user_name};
    res.render('user/userProfile.ejs',obj);
    // res.send(obj);
  } 
  else {
    res.render('user/userProfile.ejs',{usernm:"User"});
    // res.redirect("/sign");
  }
});

module.exports = router;
