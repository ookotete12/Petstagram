const express = require("express");
const app = express();
const fs = require('fs');
const request = require("request");
const session = require('client-sessions');
const sha1 = require('sha1');
app.use(session({
    cookieName: 'session',
    secret: 'petstagram',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

var mysql = require('mysql');
const bodyParser = require("body-parser");
var database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Android520!',
    database: "dbname"
})

database.connect(function(err){
    if (err){
        console.log("Error connecting to database\n" + JSON.stringify(err,undefined,2));
    }
    else{
        console.log("databse success")
    }
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());
app.post('/login',function(req,res){
    var user = req.body.Username; //email
    var check_Exist = "SELECT Email,Password FROM user_info WHERE Email = '"+String(req.body.Username)+"' and Password = '"+sha1(String(req.body.Password))+"'";
    console.log(req.body.Username);
    console.log(sha1(req.body.Password));
    database.query(check_Exist,function(err,result){
        if (err){
            console.login('[login Error] - ',err.message);
            return;
        }
        if(result==''){
            console.log('email or password is not exist');
            res.redirect('login.html?msg=1');
        }
        else{
            console.log('ok');
            req.session.user = req.body.Username;
            res.redirect('./homepage');

        }
        
    });
});
app.post('/register',function(req,res){
    var check_Email = "SELECT Email FROM user_info WHERE Email = '"+String(req.body.email)+"'";
    database.query(check_Email,function(err,result){
        if (err){
            console.login('[login Error] - ',err.message);
            return;
        }
        if(result==''){
            console.log('email or password is not exist');
            var sql = 'INSERT INTO user_info (First_name,Last_name,Email,Password) VALUES ("';
                sql += String(req.body.firstname) + '","' ;
                sql +=  String(req.body.lastname) +  '","';
                sql +=  String(req.body.email)+ '","' ;
                sql +=  sha1(String(req.body.password)) + '");';
     
            database.query(sql,function(err,rows,fileds){
                console.log(err);
    });
            res.redirect('/login')
            
        }
        else{
            console.log('email existed');
            res.redirect('createaccount.html?msg=2');
            
        }
        

    });
    
});


app.post('/findpassword',function(req,res){
    var check_Email = "SELECT Email FROM user_info WHERE Email = '"+String(req.body.find_email)+"'";
    //console.log(String(req.body.new_password));
    database.query(check_Email,function(err,result){
        if (err){
            console.login('[login Error] - ',err.message);
            return;
        }
        if(result==''){
            console.log('email is not exist')
            res.redirect('forgotpw.html?msg=3')

        }
        else{
           
            var updates = "UPDATE user_info SET Password = '"+ sha1(String(req.body.new_password))+"' WHERE Email = '"+String(req.body.find_email)+"'";
            database.query(updates,function(err,result){
                if (err){
                    console.login('[login Error] - ',err.message);
                    return;
                }
                else{
                    console.log('works');
                }
            });
            
       
        }
    });

    });

app.get('/logout',function(req,res){
    req.session.reset();
    req.session.message = 'youe logged out';
    console.log('1');
    return res.redirect('/login');
});


app.listen(8080,function(){
    console.log("running server at http://localhost:8080/login.html")
});

