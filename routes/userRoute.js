var express=require('express');
const router=express.Router();

const sendOTP=require('../Email');
var exe=require('../connection');


// home page
router.get('/',async(req,res)=>{
    //services
    var sql1=`select* from service`;
    var d1=await exe(sql1);

    //team members
    var sql2=`select* from team`;
    var d2=await exe(sql2);
    
    const obj={data:d1, data1:d2};
    res.render('user/home.ejs',obj);
})



//booking
router.post('/booktable',async(req,res)=>{
    if(req.session.user_id){
        const {booking_name,booking_email,booking_date,booking_time,booking_no}=req.body;
        var sql=`insert into booking(name,email,booking_date,booking_time,no) values('${booking_name}','${booking_email}','${booking_date}','${booking_time}','${booking_no}')`;
        await exe(sql);
        res.send(`<script>
               alert("Table Booking Successfully");
               location.href='/';
            </script>`)
    }
    else{
        res.redirect('/sign');
    }
})




//contact
router.post('/savecontact',async(req,res)=>{
    if(req.session.user_id)
    {
         const {name,email,subject,msg}=req.body;
         var sql=`insert into contact(Name,Email,Subject,Message) values('${name}','${email}','${subject}','${msg}')`;
         await exe(sql);
         res.redirect('/');
    }
    else{
        res.redirect('/sign');
    }
})





//sign in 
router.get('/sign',(req,res)=>{
    res.render('user/sign.ejs');
})
router.post('/loginuser',async(req,res)=>{
    const {user_email,user_pass}=req.body;
    var sql=`select* from user where user_email='${user_email}' AND user_pass='${user_pass}'`;
    var data=await exe(sql);
    if(data.length>0)
    {
        req.session.user_loginId=data[0].user_id;
        
        var otp=Math.trunc(Math.random()*10000);
        sendOTP(user_email,data[0].user_name,otp);

        req.session.user_otp=otp;
        res.redirect('/accept_otp');
    }
    else{
        res.redirect('/sign');
    }
})
router.get('/accept_otp',(req,res)=>{
    if(req.session.user_loginId)
    {
        res.render('user/acceptOtp.ejs');
    }
    else{
        res.redirect('/sign');
    }
})
router.post('/verifyotp',(req,res)=>{
    if(req.body.user_otp==req.session.user_otp)
    {
        req.session.user_id=req.session.user_loginId;
        res.redirect('/');
    }
    else{
        res.redirect('/accept_otp');
    }
})



//sign up 
router.get('/signup',(req,res)=>{
    res.render('user/signup.ejs');
})
router.post('/adduser',async(req,res)=>{
    const {user_name,user_email,user_pass}=req.body;
    var sql=`insert into user(user_name,user_email,user_pass) values('${user_name}','${user_email}','${user_pass}')`;
    await exe(sql);
    res.redirect('/sign');
})



module.exports=router;