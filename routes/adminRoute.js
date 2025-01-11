var express = require("express");
const router = express.Router();

var exe = require("../connection");



//admin panel
router.get("/", async (req, res) => {
  if (req.session.admin_id) {
    // service data read
    var sql1 = `select* from service`;
    var d1 = await exe(sql1);

    const obj = { data: d1 };
    res.render("admin/home.ejs", obj);
  } else {
    res.redirect("/admin/login");
  }
});





//services

// create- insert
router.post("/saveservice", async (req, res) => {
  const { serv_name, serv_info } = req.body;

  var file = req.files.serv_img;
  var filename = new Date().getTime() + "_" + file.name;
  file.mv("public/uploads/" + filename);

  var sql = `insert into service(serv_name,serv_info,serv_img) values('${serv_name}','${serv_info}','${filename}')`;
  await exe(sql);
  res.redirect("/admin");
});

// delete
router.get("/delete_serv/:id", async (req, res) => {
  var id = req.params.id;
  var sql = `delete from service where Id='${id}'`;
  await exe(sql);
  res.redirect("/admin");
});

// update
router.get("/edit_serv/:id", async (req, res) => {
  var id = req.params.id;
  var sql = `select* from service where Id='${id}'`;
  var data1 = await exe(sql);
  res.render("admin/edit_service.ejs", { data: data1[0] });
});





//team
router.get("/team", async (req, res) => {
  if (req.session.admin_id) {
    //team data read
    var sql2 = `select* from team`;
    var d2 = await exe(sql2);
    const obj = { data1: d2 };
    res.render("admin/team.ejs", obj);
  } else {
    res.redirect("/admin/login");
  }
});

router.post("/savemember", async (req, res) => {
  const { name, role } = req.body;
  //profile img
  var file = req.files.profile;
  var filename = new Date().getTime() + "_" + file.name;
  file.mv("public/uploads/" + filename);

  var sql = `insert into team(Name,Role,Profile) values('${name}','${role}','${filename}')`;
  await exe(sql);
  res.redirect("/admin");
});




//contact
router.get("/contact", async (req, res) => {
  if (req.session.admin_id) {
    //contact
    var sql3 = `select* from contact`;
    var d3 = await exe(sql3);
    const obj = { data2: d3 };
    res.render("admin/contact.ejs", obj);
  } 
  else {
    res.redirect("/admin/login");
  }
});
// delete
router.get("/contact_del/:id", async (req, res) => {
  var id = req.params.id;
  var sql = `delete from contact where Id='${id}'`;
  await exe(sql);
  res.redirect("/admin");
});




//booking
router.get("/book", async (req, res) => {
  if (req.session.admin_id) {
  var sql = `select* from booking`;
  var data = await exe(sql);
  const obj = { data3: data };
  res.render("admin/book.ejs", obj);
  }
  else{
    res.redirect("/admin/login");
  }
});


//user information
router.get("/user",async(req,res)=>{
  if(req.session.admin_id)
  {
       var sql=`select* from user`;
       var d=await exe(sql);
       const obj={data:d};
       res.render('admin/user.ejs',obj);
  }
  else{
    res.redirect('/admin/login');
  }
})






// admin login
var sendOTP = require("../Email.js");
router.get("/login", (req, res) => {
  res.render("admin/login.ejs");
});

router.post("/loginadmin", async (req, res) => {
  const { admin_email, admin_pass } = req.body;
  var sql = `select* from admin where admin_email='${admin_email}' AND admin_pass='${admin_pass}'`;
  var data = await exe(sql);

  if (data.length > 0) {
    req.session.login_id = data[0].Id;

    var otp = Math.trunc(Math.random() * 10000);
    req.session.admin_otp = otp;

    sendOTP(admin_email, data[0].admin_name, otp);
    res.redirect("/admin/accept_otp");
  } else {
    res.redirect("/admin/login");
  }
});
router.get("/accept_otp", (req, res) => {
  if (req.session.login_id) {
    res.render("admin/acceptOTP.ejs");
  } else {
    res.redirect("/admin/login");
  }
});
router.post("/verify_otp", (req, res) => {
  if (req.session.admin_otp == req.body.admin_otp) {
    req.session.admin_id = req.session.login_id;
    res.redirect("/admin");
  } else {
    res.redirect("/admin/login");
  }
});

module.exports = router;
