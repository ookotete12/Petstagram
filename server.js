const express = require("express");
const app = express();
const request = require("request");
const session = require('client-sessions');
const sha1 = require('sha1');
const bodyParser = require("body-parser");
const mysql = require('mysql');

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({
    extended:false
}));

app.use(session({
    cookieName: 'session',
    secret: 'petstagram',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

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

var namestring=''
app.use(bodyParser.json());
app.post('/login',function(req,res){
    var check_Exist = "SELECT Email,Password FROM user_info WHERE Email = '"+String(req.body.Username)+"' and Password = '"+sha1(String(req.body.Password))+"'";
    var name = "SELECT First_Name, Last_Name FROM user_info WHERE Email = '"+String(req.body.Username)+ "'";
    database.query(check_Exist,function(err,result){
        
        if (err){
            console.log('[login Error] - ',err.message);
            return;
        }
        if(result==''){
            console.log('email or password is not exist');
            res.redirect('/public/login.html?msg=1');
        }
        else{
            console.log('ok');
            database.query(name,function(err,result,fileds){
                if (err) throw err;
                Object.keys(result).forEach(function(key){
                    var row = result[key];
                    console.log(row.First_Name)
                    console.log(row.Last_Name)
                    req.session.user = req.body.Username;
                    namestring = namestring + row.First_Name + ' ' + row.Last_Name;
                    console.log(namestring);
                    res.redirect('/homepage/' + row.First_Name +" " + row.Last_Name);
                });
                
            });
            
        }
    });
});
app.post('/register',function(req,res){
    var check_Email = "SELECT Email FROM user_info WHERE Email = '"+String(req.body.email)+"'";
    database.query(check_Email,function(err,result){
        if (err){
            console.log('[login Error] - ',err.message);
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
            res.redirect('/public/login.html')
            
        }
        else{
            console.log('email existed');
            res.redirect('/public/createaccount.html?msg=2');
            
            
            
        }
        

    });
    
});


app.post('/findpassword',function(req,res){
    var check_Email = "SELECT Email FROM user_info WHERE Email = '"+String(req.body.find_email)+"'";
    //console.log(String(req.body.new_password));
    database.query(check_Email,function(err,result){
        if (err){
            console.log('[login Error] - ',err.message);
            return;
        }
        if(result==''){
            console.log('email is not exist')
            res.redirect('/public/forgotpw.html?msg=3')

        }
        else{
           
            var updates = "UPDATE user_info SET Password = '"+ sha1(String(req.body.new_password))+"' WHERE Email = '"+String(req.body.find_email)+"'";
            database.query(updates,function(err,result){
                if (err){
                    console.log('[login Error] - ',err.message);
                    return;
                }
                else{
                    console.log('works');
                    res.redirect('/public/login.html')
                }
            });
            
       
        }
    });

    });


app.get('/logout', function(req,res){
    req.session.reset();
    req.session.message = 'you have logged out';
    console.log("1");
    return res.redirect('/public/login');
})

app.get('/homepage/:name',function(req,res){
    console.log('pass')
    var username = 'INSERT INTO feed (username,post) VALUES ("';
    username += String(namestring) + '","' ;
    username +=  String(req.body.post) +  '")';
    database.query(username,function(err,rows,fileds){
        console.log(err);
    var post = req.body.post;
    console.log(post);
    
    
});
    res.render("homepage", {person: req.params.name});
});

app.post('/store', function(req,res){
    res.render("store");
})

app.listen(8080,function(){
    console.log("running server at http://localhost:8080/creataccount.html")
});

