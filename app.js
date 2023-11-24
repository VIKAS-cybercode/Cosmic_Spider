var app=require("express")();
var bodyParser = require('body-parser');
var http=require("http").Server(app);
const io = require('socket.io')(http, {
  maxHttpBufferSize: 1e50 // more than 200MB
});
const express=require("express");

const session = require('express-session');
app.use(express.json());
const {collection,profile}=require("./mongodb")
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'mySuperSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

var user_n="";
app.get("/",function(req,res){
   res.sendFile(__dirname+"/HTML/index.html");
});
app.get("/HTML/index.html",function(req,res){
   res.sendFile(__dirname+"/HTML/index.html");
});
app.get("/HTML/gamepage.html",function(req,res){
   if(user_n){
   res.sendFile(__dirname+"/HTML/gamepage.html");
   user_n="";}
});
app.get('/CSS/index-style.css',function(req,res){
   res.sendFile(__dirname+"/CSS/index-style.css");
});
app.get('/CSS/gamepage-style.css', function(req, res) {
   res.sendFile(__dirname + "/CSS/" + "gamepage-style.css");
 });
app.get('/JavaScript/main.js',function(req,res){
  res.sendFile(__dirname+"/JavaScript/main.js");
}); 
app.get('/media/favicon.ico',function(req,res){
  res.sendFile(__dirname+"/media/favicon.ico");
}); 
app.get('/media/background-image2.jpg',function(req,res){
  res.sendFile(__dirname+"/media/background-image2.jpg");
});
app.get('/JavaScript/index.js',function(req,res){
  res.sendFile(__dirname+"/JavaScript/index.js");
});

app.get('/CSS/login.css',function(req,res){
  res.sendFile(__dirname+"/CSS/login.css");
});
app.get('/media/logo.gif',function(req,res){
  res.sendFile(__dirname+"/media/logo.gif");
});
app.get('/HTML/signup.html',function(req,res){
  res.sendFile(__dirname+"/HTML/signup.html");
});
app.get('/CSS/signup.css',function(req,res){
  res.sendFile(__dirname+"/CSS/signup.css");
});
app.get('/HTML/login.html',function(req,res){
   res.sendFile(__dirname+"/HTML/login.html");
 });
 app.get('/media/logo-gamepage.gif',function(req,res){
   res.sendFile(__dirname+"/media/logo-gamepage.gif");
 }); 
 app.get('/HTML/profile.html',function(req,res){
   res.sendFile(__dirname+"/HTML/profile.html");
 })
 app.get('/JavaScript/profile.js',function(req,res){
   res.sendFile(__dirname+"/JavaScript/profile.js")
 })
 app.get('/CSS/profile-style.css',function(req,res){
   res.sendFile(__dirname+"/CSS/profile-style.css");
 })
 app.get("/media/image1.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image1.jpg");
 })
 app.get("/media/image2.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image2.jpg");
 })
 app.get("/media/image3.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image3.jpg");
 })
 app.get("/media/image4.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image4.jpg");
 })
 app.get("/media/image5.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image5.jpg");
 })
 app.get("/media/image6.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image6.jpg");
 })
 app.get("/media/image7.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image7.jpg");
 })
 app.get("/media/image1.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image1.jpg");
 })
 app.get("/media/image8.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image8.jpg");
 })
 app.get("/media/image9.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image9.jpg");
 })
 app.get("/media/image10.jpg",function(req,res){
   res.sendFile(__dirname+"/media/image10.jpg");
 })
 app.get('/media/tick_tick.mp3',function(req,res){
   res.sendFile(__dirname+"/media/tick_tick.mp3");
 })
 app.get('/media/time_up.mp3',function(req,res){
   res.sendFile(__dirname+"/media/time_up.mp3");
 })
 app.get('/Curser/pencil.svg',function(req,res){
   res.sendFile(__dirname+"/Curser/pencil.svg");
 })
 app.get('/Curser/rectangle.svg',function(req,res){
   res.sendFile(__dirname+"/Curser/rectangle.svg");
 })
 app.get('/Curser/triangle.svg',function(req,res){
  res.sendFile(__dirname+"/Curser/triangle.svg");
})
app.get('/Curser/circle.svg',function(req,res){
  res.sendFile(__dirname+"/Curser/circle.svg");
})
app.get('/Curser/line.svg',function(req,res){
  res.sendFile(__dirname+"/Curser/line.svg");
})
app.get('/Curser/fill.svg',function(req,res){
  res.sendFile(__dirname+"/Curser/fill.svg");
})
app.get('/Curser/eraser-solid.svg',function(req,res){
  res.sendFile(__dirname+"/Curser/eraser-solid.svg");
})

 app.get('/HTML/audio.mp3',function(req,res){
   res.sendFile(__dirname+"/HTML/audio.mp3");
 })
 app.get('/HTML/gmail.svg',function(req,res){
  res.sendFile(__dirname+"/HTML/gmail.svg");
})

 app.get('/getProfileData', (req, res) => {
   if (req.session.user) {
     res.json(req.session.user); // Sending user data to client
   } else {
     res.status(401).send('Not logged in');
   }
 });

 app.put('/update', async (req, res) => {
  await profile.updateOne(
    { name: req.body.name },
    { $set: { 'profileimg': Number(req.body.value) } }
  );
  console.log("updated");
});



users=[];
broadcastt=[];
SID=[];
let myMap1=new Map();
let myMap2=new Map();
let positionMap=new Map([...myMap2.entries()].sort((a,b)=>b[1]-a[1]));
arr1=['apple', 'banana', 'car', 'dog', 'elephant', 'fan', 'grape', 'hat', 'ice cream', 'jacket', 'kettle', 'lamp', 'mango', 'notebook', 'orange', 'pencil', 'rabbit', 'spoon', 'table', 'umbrella', 'vase', 'watermelon', 'xylophone', 'yacht', 'zebra', 'ant', 'ball', 'cat', 'duck', 'eagle', 'fish', 'giraffe', 'horse', 'iguana', 'jackal', 'kangaroo', 'lion', 'monkey', 'nest', 'owl', 'parrot', 'quail', 'rat', 'snake', 'tiger', 'unicorn', 'vulture', 'wolf', 'x-ray fish', 'yak', 'zebu', 'airplane', 'boat', 'cycle', 'drum', 'earphone', 'flute', 'guitar', 'harmonica', 'ipad', 'juicer', 'keyboard', 'laptop', 'mobile', 'nail cutter', 'oven', 'piano', 'quiver', 'ruler', 'scissors', 'television', 'utensils', 'violin', 'washing machine', 'xerox machine', 'yoyo', 'zipper', 'alarm clock', 'basket', 'candle', 'diary', 'eraser', 'fork', 'glass', 'hammer', 'ink', 'jug', 'knife', 'lock', 'mirror', 'needle', 'oil can', 'pillow', 'quartz', 'rose', 'soap', 'toothbrush', 'umbrella', 'violin', 'wallet', 'xmas tree', 'yogurt', 'zip'];
guessed_users=[];
var user_id;
var guess_t=0;

var socket1;
io.on('connection',function(socket){
 console.log("user connected "+socket.id);
 if (typeof socket1 === 'undefined' || socket1 === null) {
   socket1 = socket;
 }
 socket.on('disconnect', function () {
   console.log('User disconnected: ' + socket.id);
   // Emit 'user-disconnected' event to all other sockets
   var UD=myMap1.get(socket.id);
   myMap1.delete(socket.id);
   var index = SID.indexOf(socket.id);
   if (index > -1) {
    SID.splice(index, 1);
   }
   var index1=users.indexOf(UD);

   if (index1 > -1) {
      users.splice(index1, 1);
     }
   socket.broadcast.emit('user-disconnected', {SD:socket.id,usd:UD});
});
socket.on('feed-d',function(data){
   SID.push(data.Sid);
   console.log("in SID"+data.Sid);
   myMap1.set(data.Sid,data.U);
   myMap2.set(data.U,0);
   positionMap=new Map([...myMap2.entries()].sort((a,b)=>b[1]-a[1]));
})
  
 socket.on('setUsername',function(data){
    console.log(data+' user connected '+socket.id); 

    if(users.indexOf(data)>-1){
        socket.emit("user_exist",data+" user name already in use");
    }
    else{
        users.push(data);
        user_n=data;
        socket.emit("setUser",{username:data});
        
    }
 })
 socket.on('setL',function(data){
   if(broadcastt.indexOf(data)<0){
    socket.broadcast.emit('setLead',data)
    broadcastt.push(data);
    
   }
   
    for(let index=0;index<users.length;index++){   
    socket.emit('setLead',users[index])}
    
 })
 socket.on('msg',function(data){
    io.sockets.emit('newmsg',data);//for broadcasting the message to all user
 })
 //
 socket.on('user-L',function(data){
    socket.emit('remove-user',data);
 })
 socket.on('setU_C',function(){
   socket.emit('setU_S',SID.length);
 })
 
  
//----------------word given javascript----------//
socket.on('giveWordC',function(data){
   random_word=arr1[Math.floor(Math.random()*arr1.length)];
   random_word_sign="";
   for(let i=0;i<random_word.length;i++){
      if(random_word[i]===' '){
        random_word_sign+="  ";
      }
      else{
      random_word_sign+="_ ";}
   }
   var userturn=myMap1.get(SID[data.User-1]);
   io.to(SID[data.User-1]).emit('giveWordS',{guess_word:"",word:random_word,user:userturn});
   
   var socket_t = io.sockets.sockets.get(SID[data.User-1]);
   socket_t.broadcast.emit('giveWordS',{guess_word:random_word,word:random_word_sign,user:userturn});


}) 
socket.on("guess_time",function(data){
  guess_t=data;
})
// ---------------------------new draw board javascript-----------------------
socket.on('change_shapeC',function(data){
   socket.broadcast.emit('change_shapeS',data);
})
socket.on('wheelC',function(data){
   socket.broadcast.emit('wheelS',data);
})
socket.on('button2C',function(data){
   socket.broadcast.emit('button2S');
})
socket.on('fillC1',function(data){
   socket.broadcast.emit('fillS1',data);
})
socket.on('fillC2',function(data){
   socket.broadcast.emit('fillS2',data);
})
socket.on('fillC3',function(data){
   socket.broadcast.emit('fillS3',data);
})
socket.on('drawC',function(data){
   socket.broadcast.emit('drawS',data);
})
socket.on('stopC1',function(data){
   socket.broadcast.emit('stopS1',data);
})
socket.on('stopC2',function(data){
   socket.broadcast.emit('stopS2',data);
})
socket.on('stopC3',function(data){
   socket.broadcast.emit('stopS3',data);
})
socket.on('stopC4',function(data){
   socket.broadcast.emit('stopS4',data);
})
socket.on('stopC5',function(data){
   socket.broadcast.emit('stopS5',data);
})
socket.on('clear_canvasC',function(data){
   socket.broadcast.emit('clear_canvasS',data);
})
socket.on('ErsC',function(data){
   socket.broadcast.emit('ErsS',data);
})
socket.on('socketRoundC',function(data){
   io.sockets.emit('socketRoundS',data);
})
socket.on('word_guessC',function(data){
   guessed_users.push(data);
   io.sockets.emit('word_guessS',data);
})
socket.on('give_scoreC',function(){
   for(let i=0;i<guessed_users.length;i++){
      var g_u=guessed_users[i];
      io.sockets.emit('give_scoreS',{g:g_u,t:guess_t});
   }
   guessed_users.length=0;
})

//shapes-projection///
socket.on("drawLineS",function(data){
  socket.broadcast.emit("drawLineC",data);
})
socket.on("lineExS",function(data){
  socket.broadcast.emit("lineExC",data);
})
socket.on("drawRectS",function(data){
  socket.broadcast.emit("drawRectC",data);
})
socket.on("RectExS",function(data){
  socket.broadcast.emit("RectExC",data);
})
socket.on("drawCircleS",function(data){
  socket.broadcast.emit("drawCircleC",data);
})
socket.on("CircleExS",function(data){
  socket.broadcast.emit("CircleExC",data);
})
socket.on("drawTriangleS",function(data){
  socket.broadcast.emit("drawTriangleC",data);
})
socket.on("TriangleExS",function(data){
  socket.broadcast.emit("TriangleExC",data);
})

//undo -redo new function 
socket.on("UndoC",function(data){
  socket.broadcast.emit("UndoS",data);
})

socket.on("RedoC",function(data){
  socket.broadcast.emit("RedoS",data);
})
/// result board socket////////////////////////////
socket.on("displayResultS",function(){
  socket.broadcast.emit('displayResultC');
})
socket.on("showResultS",function(data){
  arr=[];
  positionMap.forEach((value, key) => {
  arr.push(key);
  });
  io.sockets.emit("showResultC",{first:arr[0],second:arr[1],third:arr[2]});
})
socket.on("removeplayerS",function(data){
  socket.broadcast.emit("removeplayerC",data);
})
//---------------------------profile page socket work------------------------------------------//

//---------------------------profile page data updation--------------------------//
socket.on('updateScore',function(data){
   myMap2.set(data.u,data.value);
   positionMap=new Map([...myMap2.entries()].sort((a,b)=>b[1]-a[1]));
})
socket.on('id-name',function(data){
   users.push(data);
})
socket.on('updateprofile',async function(data){
   for(let i=0;i<users.length;i++){
      const u = await profile.findOne({ name:users[i] });
      if(u){
         var totalgame=u.TotalGP+1;
         console.log(totalgame);
         await profile.updateOne(
            { name: users[i] },
            { $set: { 'TotalGP': totalgame } }
          );
          var highscore=u.HighestScore;
          if(Number(myMap2.get(u.name))>highscore){
            highscore=Number(myMap2.get(u.name));
          }
          await profile.updateOne(
            { name: users[i] },
            { $set: { 'HighestScore': highscore } }
          );
         var lastgamescore=u.last3game.lastgame;
         var slastgamescore=u.last3game.slastgame;
         await profile.updateOne(
            {name:users[i]},
            {$set:{last3game:{
               lastgame:Number(myMap2.get(u.name)),
               slastgame:lastgamescore,
               tlastgame:slastgamescore
            }}}
         ) 

      }
   }
})
});

app.use(express.urlencoded({extended:false}))
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post("/signup", async (req, res) => {
   const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

   const data = {
     name: req.body.name,
     password: passwordHash,
   };

   const profileInitialise={
      name:req.body.name,
      profileimg:1,
      TotalGP:0,
      HighestScore:0,
      last3game:{
         lastgame:0,
         slastgame:0,
         tlastgame:0,
      },
      last3position:{
         lastposition:0,
         slastposition:0,
         tlastposition:0,
      }
   };

   await collection.insertMany([data]);
   await profile.insertMany([profileInitialise]);
   res.redirect("/HTML/login.html");
});

 
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.name });
    if (check) {
      const match = await bcrypt.compare(req.body.password, check.password);
      if (match) {
        const user=await profile.findOne({name:req.body.name});
        req.session.user =user; // Save user data in session
        res.redirect("/HTML/profile.html");
      } else {
        res.redirect("/HTML/login.html");
      }
    } else {
      res.redirect("/HTML/login.html");
    }
  } catch (error) {
    res.send("Error in login. Please try again.");
  }
});
//profile page database_________


http.listen(3212,function(){
    console.log("server starts--");
});
