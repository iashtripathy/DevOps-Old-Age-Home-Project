const express = require("express");       // Package to look after request and respose
const bodyParser = require("body-parser");      // Package to parse the data from the HTML forms
const ejs  =require("ejs");
const mongoose = require("mongoose");         // package to connect to the database server
const multer = require("multer");             // package which creates a folder and store images there
const path = require("path");   
var cookieParser = require('cookie-parser');                 // it gives a unique name to the uploaded image
const logger = require("./config/logger");
const Contact = require("./models/contact_us");
const Labour = require("./models/child_labour");
const Meeting = require("./models/meeting");
const AdminDetails = require('./models/admin_details');
const authenticate = require('./authenticate');

const app = express();
app.use(cookieParser());

const dbURL = "mongodb+srv://admin:admin1234@cluster0.6jspo.mongodb.net/homeDB?retryWrites=true&w=majority"
//const dbURL = 'mongodb://mongo:27017/homeDB'
mongoose.connect(dbURL, 
    {useNewUrlParser: true, useUnifiedTopology: true}
);              // making the connection to db server

const date = new Date();

app.set('view engine','ejs');



app.use(bodyParser.urlencoded({extended: true}));        // to parse multiple inputs from a form at the same time

app.use(express.static(__dirname + '/public'));
function isLoggedIn(token){
    //console.log(typeof(token));
    if( typeof(token) === "undefined" || token.length == 0  ) {
      return false;
    }
    else{
      return true;
    }    
}

/////////////////////Request made to the home page//////////////////////////////
app.get("/", function(req,res){
    var loginStatus = false;
    if(isLoggedIn(req.cookies.admintoken)){
        loginStatus = true;
    }
    else{
        loginStatus = false;
    }
    logger.info("Home page request");
    res.render("home",{date: date,loginStatus:loginStatus});
});



/////////////////////Getting data from the contact us form////////////////////////
app.post("/", function(req,res){

        const data = new Contact({
        fullname: req.body.fullname,
        email: req.body.email,
        subject: req.body.subject,
        description: req.body.textarea
    });

     
    console.log(data);

    data.save(function(err,result){

        if(err){
          logger.error(err);
          logger.info("contact_us entry error");
          res.sendFile(__dirname + "/failure.html");
        }
        else{
          logger.info("Entry saved for contact-us");
          res.sendFile(__dirname + "/success.html");
        }
    });

    
});


////////////////////Request made to the adoption page/////////////////////////////
app.get("/adoption", function(req,res){

    var loginStatus = false;
    if(isLoggedIn(req.cookies.admintoken)){
        loginStatus = true;
    }
    else{
        loginStatus = false;
    }
    
    logger.info("Adoption page request");

    res.render("adoption",{loginStatus:loginStatus});
});




/////////////////////Getting data from the book a meeting form//////////////////////
app.post("/adoption", function(req,res){
   
    const data = new Meeting({
        fullname: req.body.fullname,
        gender: req.body.gender,
        marriage: req.body.marriage,
        age: req.body.age,
        email: req.body.email,
        address: req.body.address,
        job: req.body.job,
        income: req.body.income,
        phonenumber: req.body.phonenumber,
        date: req.body.meeting,
        time: req.body.time,
        reason: req.body.reason
    });

    console.log(data);

    data.save(function(err,result){

        if(err){
            console.log(err);
          logger.error(err);
          logger.info("Meeting entry error");
          res.sendFile(__dirname + "/failure.html");
        }
        else{
          logger.info("Booking a Meeting form entry saved");
          res.sendFile(__dirname + "/success.html");
        }
          
    });
});


/////////////////////Request made to the child labour page/////////////////////////
app.get("/report-homeless", function(req,res){

    var loginStatus = false;
    if(isLoggedIn(req.cookies.admintoken)){
        loginStatus = true;
    }
    else{
        loginStatus = false;
    }

    logger.info("Report homeless person page request");

    res.render("report_homeless",{loginStatus:loginStatus});
});


////////////////////Getting data from the child_labour form////////////////////////

const Storage1 = multer.diskStorage({

    destination: "./public/uploads",
    filename: (req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});

const upload = multer({
    storage: Storage1

}).single('filename');


app.post("/report-homeless",upload, function(req,res){

    const data= new Labour({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        state: req.body.state,
        district: req.body.district,
        landmark: req.body.landmark,
        filename: req.file.filename,
        description: req.body.description
    });

    console.log(data);

    data.save(function(err,result){

        if(err){
          logger.error(err);
          logger.info("Report homeless entry error");
          res.sendFile(__dirname + "/failure.html");
        }
        else{
          logger.info("Report homeless post request saved");
          res.sendFile(__dirname + "/success.html");
        }
    });
});


/////////////////////Request made to the donation page/////////////////////////////
app.get("/donation", function(req,res){
    
    var loginStatus = false;
    if(isLoggedIn(req.cookies.admintoken)){
        loginStatus = true;
    }
    else{
        loginStatus = false;
    }
    logger.info("Donation page request");

    res.render("donation",{loginStatus:loginStatus});
});

/* -------------------------------Admin Login--------------------------------------------------*/

app.get('/admin-login',function(req,res){
    var loginStatus = false;
    if(isLoggedIn(req.cookies.admintoken)){
        loginStatus = true;
    }
    else{
        loginStatus = false;
    }
    logger.info("Admin Login page request");
    res.render('admin_login',{type:'login',loginStatus:loginStatus});
})



app.post('/admin-login',async function(req,res){
    console.log(req.body.username);
    var admin = await AdminDetails.findOne({email: req.body.email});
      if (!admin) {
        logger.error("Admin Not Found");
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({status:"Admin "+" not found"});
        //return next(err);
      }
      else{
        //const validPassword = await bcrypt.compare(req.body.password,admin.hashPassword);
        const validPassword = (admin.password == req.body.password);
        if(!validPassword){
          res.statusCode = 400;
          logger.error("Wrong password entered by admin");
          res.setHeader('Content-Type', 'application/json');
          res.json({success:false,status:"Wrong password"});
        }
        else if(validPassword){
          //res.setHeader('Content-Type', 'application/json');
          
          var token = authenticate.getToken({_id: admin._id});
          //var token = "I am admin";
          //res.setHeader('Content-Type', 'application/json');
          //localStorage.setItem('admintoken', token);
          res.cookie('admintoken', token);
          //res.cookie('userId', admin._id);
          //res.send({success: true,status:'You are authenticated!',token:token});
          logger.info("Admin Login Successful");
          res.redirect('/');
        }
      }
  });




/*------------------------------------View Reported Homeless Data------------------------------------------------ */
app.get('/homeless-persons-data',[authenticate.verifyUser],async function(req,res){
    var data = await Labour.find({}).select(['-_id']);
    if(data===undefined){
        logger.info("No homeless person data found");
        alert("No Data");
    }
    else{
        //res.json(data);
        logger.info("homeless person data display page request");
        res.render('homeless_person_complain.ejs',{loginStatus : true, records : data})
    }
    
    
})




/*------------------------------------View Meeting Requests------------------------------------------------ */
app.get('/meeting-data',[authenticate.verifyUser],async function(req,res){
    var data = await Meeting.find({}).select(['-_id']);
    if(data===undefined){
        logger.info("No meetings data found");
        alert("No Data");
    }
    else{
        //res.json(data);
        logger.info("All meetings data display page request");
        res.render('meetings',{loginStatus : true, records : data})
    }
    
    
})


/*----------------------------------------------------------Logging out admin----------------------------------------------------------*/

app.get('/admin-logout', (req, res) => {
    console.log(req.headers);
    logger.info("Logging out admin");
    res.setHeader('Content-Type','application/json');
    res.cookie('admintoken','');
    
    //res.json({success: true,status:"Logged Out Successfully"});
    res.redirect('/');
  });



////////////////////Browser making a get request to our server at port 3000//////////////////////////

app.listen(3000, function(){
    logger.info("Server started on port 3000");
    console.log("Server started on port 3000");

    //logger.info("Server started on port 3000");
});


module.exports = app;
