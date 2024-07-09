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


app.get("/",function(req,res){
   res.sendFile(__dirname+"/HTML/index.html");
});
app.get("/HTML/index.html",function(req,res){
   res.sendFile(__dirname+"/HTML/index.html");
});
app.get("/HTML/gamepage.html",function(req,res){
   
   res.sendFile(__dirname+"/HTML/gamepage.html");
   
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

app.post('/getProfileData', async (req, res) => {
  try {
      const { token } = req.body;
      const user = await profile.findOne({name:token });

      if (user) {
          res.json(user);
      } else {
          res.status(404).json({ error: "User not found" });
      }
  } catch (error) {
      console.error("Error fetching profile data:", error);
      res.status(500).json({ error: "Internal Server Error" });
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
let guessed_usersTime=new Map();
arr1=['apple', 'banana', 'car', 'dog', 'elephant', 'fan', 'grape', 'hat', 'ice cream', 'jacket', 'kettle', 'lamp', 'mango', 'notebook', 'orange', 'pencil', 'rabbit', 'spoon', 'table', 'umbrella', 'vase', 'watermelon', 'xylophone', 'yacht', 'zebra', 'ant', 'ball', 'cat', 'duck', 'eagle', 'fish', 'giraffe', 'horse', 'iguana', 'jackal', 'kangaroo', 'lion', 'monkey', 'nest', 'owl', 'parrot', 'quail', 'rat', 'snake', 'tiger', 'unicorn', 'vulture', 'wolf', 'x-ray fish', 'yak', 'zebu', 'airplane', 'boat', 'cycle', 'drum', 'earphone', 'flute', 'guitar', 'harmonica', 'ipad', 'juicer', 'keyboard', 'laptop', 'mobile', 'nail cutter', 'oven', 'piano', 'quiver', 'ruler', 'scissors', 'television', 'utensils', 'violin', 'washing machine', 'xerox machine', 'yoyo', 'zipper', 'alarm clock', 'basket', 'candle', 'diary', 'eraser', 'fork', 'glass', 'hammer', 'ink', 'jug', 'knife', 'lock', 'mirror', 'needle', 'oil can', 'pillow', 'quartz', 'rose', 'soap', 'toothbrush', 'umbrella', 'violin', 'wallet', 'xmas tree', 'yogurt', 'zip'];
guessed_users=[];
const user_data=[];
//function for stored user name room and its id
function userJoin(id,username,room){
  const user={id,username,room};
  user_data.push(user);
  return user;
}
//*********** get current user *******************//
function getCurrentUser(id){
  return user_data.find(user=>user.id==id);
}
function getCUBN(name){
  return user_data.find(user=>user.username===name);
}

var socket1;
io.on('connection',function(socket){

 socket.on('joinRoom',({name,Roomname})=>{
  const user=userJoin(socket.id,name,Roomname);
  socket.join(user.room);
  
 });
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
    console.log(data+'**user connected '+socket.id); 
    const u =  profile.findOne({ name:data });
    if(users.indexOf(data)>-1){
        socket.emit("user_exist",data+" user name already in use");
    }
    else{
        users.push(data);
        // socket.emit("setUser",{username:data});
        console.log("&");
        
    }
 })
 socket.on('setL',function(data){
  const user=getCUBN(data);
  console.log(user.room+"***");
   if(broadcastt.indexOf(data)<0){
    socket.broadcast.to(user.room).emit('setLead',data);
    broadcastt.push(data);
    
   }
   console.log(users.length);
    for(let index=0;index<users.length;index++){   
    var u=getCUBN(users[index]); 
    if(u.room===user.room)  {
      console.log(users[index]);
    socket.emit('setLead',users[index])
    }}
    
 })
 socket.on('msg',function(data){
    const user=getCurrentUser(socket.id);
    io.to(user.room).emit('newmsg',data);//for broadcasting the message to all user of that room
 })
 //
 socket.on('user-L',function(data){
    socket.emit('remove-user',data);
 })
 socket.on('setU_C',function(){
  var n=0;
  const user=getCurrentUser(socket.id);
  for(let i=0;i<users.length;i++){
    const u=getCUBN(users[i]);
    if(u.room===user.room)
    n=n+1;
  }
    socket.emit('setU_S',n);
 })
 
  
//----------------word given javascript----------//
socket.on('giveWordC',function(data){
   random_word=arr1[Math.floor(Math.random()*arr1.length)];
   random_word_sign="";
   const user=getCUBN(data.user);
   for(let i=0;i<random_word.length;i++){
      if(random_word[i]===' '){
        random_word_sign+="  ";
      }
      else{
      random_word_sign+="_ ";}
   }
   var i=0;
   var t=data.U;
   while (t !== 0 && i < SID.length) {
    if (getCurrentUser(SID[i]).room === user.room) {
        t = t - 1;
    }
    i = i + 1;
}
i=i-1;


// Ensure i is within bounds
i = Math.min(i, SID.length - 1);
   var userturn=myMap1.get(SID[i]);

   io.to(SID[i]).emit('giveWordS',{guess_word:"",word:random_word,user:userturn});
   var socket_t = io.sockets.sockets.get(SID[i]);
   socket_t.broadcast.to(user.room).emit('giveWordS',{guess_word:random_word,word:random_word_sign,user:userturn});


}) 
socket.on("guess_time",function(data){
  guessed_usersTime.set(data.user,data.t);
})
// ---------------------------new draw board javascript-----------------------
socket.on('change_shapeC',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('change_shapeS',data);
})
socket.on('wheelC',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('wheelS',data);
})
socket.on('button2C',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('button2S');
})
socket.on('fillC1',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('fillS1',data);
})
socket.on('fillC2',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('fillS2',data);
})
socket.on('fillC3',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('fillS3',data);
})
socket.on('drawC',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('drawS',data);
})
socket.on('stopC1',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('stopS1',data);
})
socket.on('stopC2',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('stopS2',data);
})
socket.on('stopC3',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('stopS3',data);
})
socket.on('stopC4',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('stopS4',data);
})
socket.on('stopC5',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('stopS5',data);
})
socket.on('clear_canvasC',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('clear_canvasS',data);
})
socket.on('ErsC',function(data){
  const user=getCurrentUser(socket.id);
   socket.broadcast.to(user.room).emit('ErsS',data);
})
socket.on('socketRoundC',function(data){
  const user=getCurrentUser(socket.id);
   io.to(user.room).emit('socketRoundS',data);
})
socket.on('word_guessC',function(data){
   guessed_users.push(data);
   const user=getCurrentUser(socket.id);
   io.to(user.room).emit('word_guessS',data);
})
socket.on('give_scoreC',function(){
  const user=getCurrentUser(socket.id);
   for(let i=0;i<guessed_users.length;i++){ 
      var g_u=guessed_users[i];
      const u=getCUBN(g_u);
      const t=guessed_usersTime.get(u.username);
      if(u.room==user.room){
      io.to(user.room).emit('give_scoreS',{g:g_u,t:t});
      guessed_users.splice(i, 1); 
      guessed_usersTime.delete(u.username);
      }
   }
})

//shapes-projection///
socket.on("drawLineS",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("drawLineC",data);
})
socket.on("lineExS",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("lineExC",data);
})
socket.on("drawRectS",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("drawRectC",data);
})
socket.on("RectExS",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("RectExC",data);
})
socket.on("drawCircleS",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("drawCircleC",data);
})
socket.on("CircleExS",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("CircleExC",data);
})
socket.on("drawTriangleS",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("drawTriangleC",data);
})
socket.on("TriangleExS",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("TriangleExC",data);
})

//undo -redo new function 
socket.on("UndoC",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("UndoS",data);
})

socket.on("RedoC",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("RedoS",data);
})
/// result board socket////////////////////////////
socket.on("displayResultS",function(){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit('displayResultC');
})
socket.on("showResultS",function(data){
  const user=getCurrentUser(socket.id);
  arr=[];
  positionMap.forEach((value, key) => {
  if(getCUBN(key).room===user.room)  
  arr.push(key);
  });
 
  io.to(user.room).emit("showResultC",{first:arr[0],second:arr[1],third:arr[2]});
})
socket.on("removeplayerS",function(data){
  const user=getCurrentUser(socket.id);
  socket.broadcast.to(user.room).emit("removeplayerC",data);
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
          console.log(highscore);
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
const bcrypt = require('bcryptjs');
function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

app.post("/signup", async (req, res) => {
  const hashpass=await hashPassword(req.body.password);
 
   const data = {
     name: req.body.name,
     password:hashpass,
     email:req.body.email,
     online:0,
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
      const match=bcrypt.compare(req.body.password,check.password);
      console.log(check.online);
      var index1=users.indexOf(check.name);

      if (match && check.online===0 && index1<0) {
        const user=await profile.findOne({name:req.body.name});

        // req.session.user =user;  Save user data in session
        await collection.updateOne(
         { name: req.body.name },
         { $set: { 'online': 1 } },
       );
       res.send({ "status": "success", "message": "Login Success", "token": req.body.name })
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

app.get("/logout", async (req, res) => {
  try {
    const userName = req.query.token;

    // Update the user's online status to 0 when logging out
    await collection.updateOne(
      { name: userName },
      { $set: { online: 0 } }
    );

    // Clear the user data from the session
    //req.session.user = null;

    res.redirect("/HTML/login.html");
  } catch (error) {
    res.send("Error in logout. Please try again.");
  }
});



app.post('/check-name', async (req, res) => {
  const check = await collection.findOne({ name: req.body.name });
  if (check) {
    res.json({ exists: true });
} else {
    res.json({ exists: false });
}
});




http.listen(3212,function(){
    console.log("server starts--");
});
