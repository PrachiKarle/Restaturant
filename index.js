var express=require('express');
const app=express();

//serve static files
app.use(express.static('public/'));

//handle req.body data
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//file uploading
var upload=require('express-fileupload');
app.use(upload());

//session
var session=require('express-session');
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:"prachi"
}))

//user routes
var userRoute=require('./routes/userRoute');
app.use('/',userRoute);

//admin routes
var adminRoute=require('./routes/adminRoute');


app.use('/admin',adminRoute);


//server start
const PORT=3000 || process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

// module.exports.handler=ServerlessHttp(app);