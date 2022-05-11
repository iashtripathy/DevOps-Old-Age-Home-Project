var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.getToken = function(user) {
    return jwt.sign(user, "secret" ,
        /*{expiresIn: "60s"}*/ );
};


exports.verifyUser = function(req,res,next){
    
    //console.log("Name "+req.name);   
    //console.log("TOKEN IS FOUND HERE-------",req.headers.authorization);
    //console.log("Here I am",req.cookies.admintoken);
    var token = req.cookies.admintoken;
    console.log(token);
    if(!token){
        res.statusCode = 400;
        res.setHeader('Content-Type','application/json');
        //alert("Access denied No token found");
        res.redirect('/admin-login');
        //res.json({success:false,status:'Access denied No token found'+" Login and try again"});
        
    }
    if(token){
        try{
            const tokenDecoded = jwt.verify(token,"secret");
            //console.log(tokenDecoded);
            //user is useful in /surrentUserDetails route
            req.user = tokenDecoded;
            next();
        }
        catch(err){
            console.log(err);
            res.statusCode = 400;
            //res.setHeader('Content-Type','application/json');
            res.json({success:false,status:'Invalid Token'});
        }
    }
    // next();

    
    
}