//express router
var express = require("express");
const router = express.Router();



//import connection
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
  if (req.session.admin_id) {
    const { serv_name, serv_info } = req.body;

    var file = req.files.serv_img;
    var filename = new Date().getTime() + "_" + file.name;
    file.mv("public/uploads/" + filename);

    var sql = `insert into service(serv_name,serv_info,serv_img) values(?,?,?)`;
    var values = [serv_name, serv_info, filename];
    await exe(sql, values);
    res.redirect("/admin");
  } else {
    res.redirect("/admin/login");
  }
});


// delete
router.get("/delete_serv/:id", async (req, res) => {
  if (req.session.admin_id) {
    var id = req.params.id;
    var sql = `delete from service where Id=?`;
    await exe(sql, [id]);
    res.redirect("/admin");
  } else {
    res.redirect("/admin/login");
  }
})


// update
router.get("/edit_serv/:id", async (req, res) => {
  if (req.session.admin_id) {
    var id = req.params.id;
    var sql = `select* from service where Id=?`;
    var data1 = await exe(sql, [id]);
    res.render("admin/edit_service.ejs", { data: data1[0] });
  } else {
    res.redirect("/admin/login");
  }
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
  if (req.session.admin_id) {
  const { name, role } = req.body;
  //profile img
  var file = req.files.profile;
  var filename = new Date().getTime() + "_" + file.name;
  file.mv("public/uploads/" + filename);

  var sql = `insert into team(Name,Role,Profile) values(?,?,?)`;
  await exe(sql, [name, role, filename]);
  res.redirect("/admin");
  } else {
     res.redirect("/admin/login");
  }
});






//contact
router.get("/contact", async (req, res) => {
  if (req.session.admin_id) {
    var sql3 = `select* from contact`;
    var d3 = await exe(sql3);
    const obj = { data2: d3 };
    res.render("admin/contact.ejs", obj);
  } else {
    res.redirect("/admin/login");
  }
});
// delete
router.get("/contact_del/:id", async (req, res) => {
  if (req.session.admin_id) {
    var id = req.params.id;
    var sql = `delete from contact where Id=?`;
    await exe(sql, [id]);
    res.redirect("/admin");
  } else {
     res.redirect("/admin/login");
  }
});






//booking
router.get("/book", async (req, res) => {
  if (req.session.admin_id) {
    var sql = `select* from booking`;
    var data = await exe(sql);
    const obj = { data3: data };
    res.render("admin/book.ejs", obj);
  } else {
    res.redirect("/admin/login");
  }
});
//delete booking
router.get("/del_book/:id",async(req,res)=>{
  if(req.session.admin_id)
    {
       var id=req.params.id;
       var sql=`delete from booking where id = '${id}'`;
       await exe(sql);
       res.redirect("/admin/book");
    }
    else {
      res.redirect("/admin/login");
    }
})
//edit booking
router.get('/edit_book/:id',async(req,res)=>{
    if(req.session.admin_id)
    {
        var id=req.params.id;
        var sql=`select* from booking where id = '${id}'`;
        var data1=await exe(sql);
        const obj={data:data1[0]};
        res.render('admin/edit_booking.ejs',obj);
    }
    else{
      res.redirect("/admin/login");
    }
})
// update
router.post('/updatebooking',async(req,res)=>{
     if(req.session.admin_id)
    { 
             const {id,booking_name,booking_email,booking_date,booking_time,booking_no}=req.body;
             var sql=`update booking set name='${booking_name}', email='${booking_email}',booking_date='${booking_date}', booking_time='${booking_time}', no='${booking_no}' where id = '${id}'`;
             await exe(sql);
             res.redirect("/admin/book");
      }
    else{
      res.redirect("/admin/login");
    }
})





//user information
router.get("/user", async (req, res) => {
  if (req.session.admin_id) {
    var sql = `select* from user`;
    var d = await exe(sql);
    const obj = { data: d };
    res.render("admin/user.ejs", obj);
  } else {
    res.redirect("/admin/login");
  }
});
//delete user
router.get("/delete_user/:id",async(req,res)=>{
  if(req.session.admin_id)
  {
     var id=req.params.id;
     var sql=`delete from user where user_id = '${id}'`;
     await exe(sql);
     res.redirect("/admin/user");
  }
  else {
    res.redirect("/admin/login");
  }
})








//menu

router.get("/menu", async (req, res) => {
  if (req.session.admin_id) {
    //starter
    var sql1 = `select* from starter`;
    var d1 = await exe(sql1);

    //main menu
    var sql2 = `select* from mainmenu`;
    var d2 = await exe(sql2);

    //desserts
    var sql3 = `select* from desserts`;
    var d3 = await exe(sql3);

    const obj = { starter: d1, mainmenu: d2, desserts: d3 };
    res.render("admin/menu.ejs", obj);

  } else {
    res.redirect("/admin/login");
  }
});

// insert
router.post("/addmenu", async (req, res) => {
  if (req.session.admin_id) {
  const { menu_name, menu_price, menu_category } = req.body;

  var file = req.files.menu_img;
  var filename = new Date().getTime() + "_" + file.name;
  file.mv("public/uploads/" + filename);

  var sql = `insert into ${menu_category}(menu_name,menu_price,menu_img) values(?,?,?)`;
  await exe(sql, [menu_name, menu_price, filename]);
  res.redirect("/admin/menu");

  } else {
    res.redirect("/admin/login");
  }
});

//delete
router.get("/del_menu/:id/:category", async (req, res) => {
  if (req.session.admin_id) {
    var id = req.params.id;
    var categ = req.params.category;
    var sql = `delete from ${categ} where Id=?`;
    await exe(sql, [id]);
    res.redirect("/admin/menu");
  } else {
    res.redirect("/admin/login");
  }
});

// update
router.get("/edit_menu/:id/:category", async (req, res) => {
  if (req.session.admin_id) {
    var id = req.params.id;
    var categ = req.params.category;

    var sql = `select* from ${categ} where Id=?`;
    var d = await exe(sql, [id]);
    res.render("admin/edit_menu.ejs", { data: d[0], category: categ });
  } else {
    res.redirect("/admin/login");
  }
});

router.post("/updatemenu", async (req, res) => {
  if (req.session.admin_id) {
    const { menu_id, menu_name, menu_category, menu_price } = req.body;

    if (req.files) {
      var file = req.files.menu_img;
      var filename = new Date().getTime() + "_" + file.name;
      file.mv("public/uploads/" + filename);
      var sql = `update ${menu_category} set menu_img=? where Id=?`;
      await exe(sql, [filename, menu_id]);
    }

    var sql = `update ${menu_category} set menu_name=?, menu_price=? where Id=?`;
    await exe(sql, [menu_name, menu_price, menu_id]);
    res.redirect("/admin/menu");
  }  else {
    res.redirect("/admin/login");
  }
});






// admin login
var sendOTP = require("../Email.js");

router.get("/login", (req, res) => {
  res.render("admin/login.ejs");
});

//login
router.post("/loginadmin", async (req, res) => {

  const { admin_email, admin_pass } = req.body;
  var sql = `select* from admin where admin_email=? AND admin_pass=?`;
  var data = await exe(sql, [admin_email, admin_pass]);

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

//accept otp
router.get("/accept_otp", (req, res) => {
  if (req.session.login_id) {
    res.render("admin/acceptOTP.ejs");
  } else {
    res.redirect("/admin/login");
  }
});
//verify otp
router.post("/verify_otp", (req, res) => {
  if (req.session.admin_otp == req.body.admin_otp) {
    req.session.admin_id = req.session.login_id;
    res.redirect("/admin");
  } else {
    res.redirect("/admin/login");
  }
});



module.exports = router;
