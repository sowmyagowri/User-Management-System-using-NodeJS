//import express module 
var express = require('express');
//create  an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine','ejs');
//set the directory of views
app.set('views','./views');
//specify the path of static directory
app.use(express.static(__dirname + '/public')); 

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
  }));

//Only user allowed is admin
var validUsers = [{
    "username" : "admin",
    "password" : "admin"
}];

//By Default we have 0 users
var users = []

//route to root
app.get('/',function(req,res){
    //check if user session exits
    console.log("Session Data : ", req.session.user);
    if(req.session.user){
        res.redirect('/create');
    }else
        res.render('login');
});

app.post('/login',function(req,res){
    if(req.session.user){
        res.redirect('/create');
    }else{
        console.log("In Login Post");
        console.log("Req Body : ", req.body);
        validUsers.filter(function(user){
            if(user.username === req.body.username && user.password === req.body.password){
                req.session.user = user;
                res.redirect('/create');
            }
        })
    }    
});

app.get('/create',function(req,res){
    console.log("In Get Create");
    //check if user session exits
    console.log("Session Data : ", req.session.user);
    if(req.session.user){
        res.render('create');
    }else
        res.redirect('/');
});

app.post('/create',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        console.log("In Create Post");
        console.log("Req Body : ", req.body);
        var newUser = {Name: req.body.Name, StudentID: req.body.StudentID, Department : req.body.Department};
        users.push(newUser);
        res.redirect('/list');
        console.log("User Added Successfully!!!!");
    }
});

app.get('/list',function(req,res){
    console.log("In Get List");
    console.log("Session Data : ", req.session.user);
    if(!req.session.user){
        res.redirect('/');
    }else{
        console.log("Session data : " , req.session);
        res.render('list',{
            users : users
        });
    }
});

app.get('/delete',function(req,res){
    console.log("In Delete Get");
    console.log("Session Data : ", req.session.user);
    if(req.session.user){
        res.redirect('list');
    }else
        res.redirect('/');
});

app.post('/delete/:id',function(req,res){
    console.log("In Delete Post");
    console.log("The user to be deleted", req.params.id);
    // The user to be deleted
    var id = req.params.id;
    var index = -1;
    // iterate over each element in the users array
    for (var i = 0; i < users.length; i++){
        // look for the entry with a matching user ID
        if (users[i].StudentID == id){
            //we found it
            index = i;
            break;
        }
    }
     
    if(index == -1){
        console.log("User Not Found");
    } else {
        users.splice(index, 1);
        console.log("User : " + req.body.StudentID + " was removed successfully");
        res.redirect('/list');
    }
});

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
 
});