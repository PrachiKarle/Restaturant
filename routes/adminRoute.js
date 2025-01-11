var express=require('express');
const router=express.Router();

var exe=require('../connection');

//admin panel
router.get('/',(req,res)=>{
    if(req.session.admin_id){
        res.render('admin/home.ejs');
    }
    else{
        res.redirect('/admin/login');
    }
})




//service
router.get('/add_service',(req,res)=>{
    res.render('admin/addservice.ejs');
})
router.post('/saveservice',async(req,res)=>{
    const {serv_name,serv_info}=req.body;

    var file=req.files.serv_img;
    var filename=new Date().getTime()+"_"+file.name;
    file.mv('public/uploads/'+filename);

    var sql=`insert into service(serv_name,serv_info,serv_img) values('${serv_name}','${serv_info}','${filename}')`;
    await exe(sql);
    res.redirect('/admin/service');
})
router.get('/service',async(req,res)=>{
    var sql=`select* from service`;
    var data1=await exe(sql);
    res.render('admin/service.ejs',{data:data1});
})





// admin login
var sendOTP=require('../Email.js');
router.get('/login',(req,res)=>{
   res.render('admin/login.ejs');
})

router.post('/loginadmin',async(req,res)=>{
    const {admin_email,admin_pass}=req.body;
    var sql=`select* from admin where admin_email='${admin_email}' AND admin_pass='${admin_pass}'`;
    var data=await exe(sql);
    
    if(data.length>0)
    {
        req.session.login_id=data[0].Id;

        var otp=Math.trunc(Math.random()* 10000);
        req.session.admin_otp=otp;

        sendOTP(admin_email,data[0].admin_name,otp);
        res.redirect('/admin/accept_otp');
    }
    else{
        res.redirect('/admin/login');
    }
})
router.get('/accept_otp',(req,res)=>{
    if(req.session.login_id){
        res.render('admin/acceptOTP.ejs');
    }
    else{
        res.redirect('/admin/login');
    }
})
router.post('/verify_otp',(req,res)=>{
     if(req.session.admin_otp == req.body.admin_otp)
     {
        req.session.admin_id=req.session.login_id;
        res.redirect('/admin');
     }
     else{
        res.redirect('/admin/login');
     }
})

module.exports=router;