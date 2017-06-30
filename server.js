var express = require('express')
var logger = require('morgan')
var bodyParser = require('body-parser')
var axois = require('axios')





var firebase = require('firebase')
var fb = firebase.initializeApp({
    apiKey: "AIzaSyDAzqZZ64DobePasae3G7T8wg3lTdmOZYE",
    authDomain: "code2cure.firebaseapp.com",
    databaseURL: "https://code2cure.firebaseio.com",
    projectId: "code2cure",
    storageBucket: "code2cure.appspot.com",
    messagingSenderId: "551376110218" 
})






var app = express()
app.set('view engine','ejs')
app.use(express.static('views'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.set('views',__dirname + '/views')

app.all('/*', function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
 res.header("Access-Control-Allow-Methods", "POST, GET");
 next();
});

app.get('/',function(request, response) {
    response.render('homepage.ejs', {error: null}) 
})
    
app.get('/login',function(request,response){
    response.render('login.ejs', {error: null}) 
})
    
app.get('/signup',function(request,response){
    response.render('signup.ejs', {error: null}) 
})

app.get('/girls',function(request,response){
    response.render('girls.ejs', {error: null}) 
})

app.get('/donate',function(request,response){
    response.render('donate.ejs', {error: null}) 
})

app.get('/founders',function(request,response){
    response.render('founders.ejs', {error: null}) 
})
app.get('/gallery',function(request,response){
    response.render('gallery.ejs', {error: null}) 
})
app.get('/mentors',function(request,response){
    response.render('mentors.ejs', {error: null}) 
})
app.get('/mission',function(request,response){
    response.render('mission.ejs', {error: null}) 
})

app.get('/dashboard',function(request,response){
    response.render('dashboard.ejs', {
        error: null,
        email: null,
        photoUrl: null,
        userId: null
    }) 
})

    
//login
    
app.post('/login', function(req,res){
    var email = req.body.email
    var password = req.body.password
    
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(function(response) { 
        console.log(response)      
        
        res.render('dashboard.ejs', {
            email: response.email,
            photoUrl: response.photoURL,
            userId: response.uid,
            error: null
            })
        })
            //if they sign in sucessfully send to home page
        .catch(function(error){
            console.log(error)
            res.render('login.ejs', {error: error})
        })
        
})

app.post('/signup', function(req,res){
    var email = req.body.email
    var password = req.body.password
    
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(function(response) { 
        console.log(response) 
        
        res.render('dashboard.ejs', {
            email: response.email,
            photoUrl: response.photoURL || "https://epgl.unige.ch/labs/FATEC/img/required/empty_user.png",
            userId: response.uid,
            error: null
        })  
     }) 
            
    .catch(function(error){
        console.log(error)
        res.render('signup.ejs', {error: error})
    })
    
})

app.get('/chat', function(request, response){
    var db = firebase.database()
    var messagingRef = db.ref('messages')
    
    messagingRef.limitToLast(10).once('value', function(dataSnapshot) {
        console.log("message recieved. ", dataSnapshot.val())
        response.render('chat.ejs', { messages: dataSnapshot.val() })  
    })
})

app.post('/chat', function(request, response){
    var db = firebase.database()
    var chatRef = db.ref('messages')
    var newMessageRef = chatRef.push()
        
    newMessageRef.set({
      'name': request.body.person,
      'text': request.body.message
    })
    
    chatRef.limitToLast(10).once('value', function(dataSnapshot) {
        console.log("message recieved. ", dataSnapshot.val())
        response.render('chat.ejs', { messages: dataSnapshot.val() })  
    })    
})

var port = process.env.PORT || 8080
app.listen(port, function() {
    console.log(`app running on port ${port}.`)
})
