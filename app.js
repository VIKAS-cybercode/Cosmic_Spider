var app=require("express")();
var bodyParser = require('body-parser');
var http=require("http").Server(app);
var io=require("socket.io")(http);
const express=require("express");
app.use(express.json());
const {collection,profile}=require("./mongodb")
app.use(bodyParser.urlencoded({ extended: true }));

var user_n="";
app.get("/",function(req,res){
   res.sendFile(__dirname+"/HTML/index.html");
});
app.get("/HTML/index.html",function(req,res){
   res.sendFile(__dirname+"/HTML/index.html");
});
app.get("/HTML/gamepage.html",function(req,res){
//   if(user_n){
   res.sendFile(__dirname+"/HTML/gamepage.html");
//   user_n="";}
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




users=[];
broadcastt=[];
SID=[];
let myMap1=new Map();
let myMap2=new Map();
arr1=['apple', 'banana', 'car', 'dog', 'elephant', 'fan', 'grape', 'hat', 'ice cream', 'jacket', 'kettle', 'lamp', 'mango', 'notebook', 'orange', 'pencil', 'quilt', 'rabbit', 'spoon', 'table', 'umbrella', 'vase', 'watermelon', 'xylophone', 'yacht', 'zebra', 'ant', 'ball', 'cat', 'duck', 'eagle', 'fish', 'giraffe', 'horse', 'iguana', 'jackal', 'kangaroo', 'lion', 'monkey', 'nest', 'owl', 'parrot', 'quail', 'rat', 'snake', 'tiger', 'unicorn', 'vulture', 'wolf', 'x-ray fish', 'yak', 'zebu', 'airplane', 'boat', 'cycle', 'drum', 'earphone', 'flute', 'guitar', 'harmonica', 'ipad', 'juicer', 'keyboard', 'laptop', 'mobile', 'nail cutter', 'oven', 'piano', 'quiver', 'ruler', 'scissors', 'television', 'utensils', 'violin', 'washing machine', 'xerox machine', 'yoyo', 'zipper', 'alarm clock', 'basket', 'candle', 'diary', 'eraser', 'fork', 'glass', 'hammer', 'ink', 'jug', 'knife', 'lock', 'mirror', 'needle', 'oil can', 'pillow', 'quartz', 'rose', 'soap', 'toothbrush', 'umbrella', 'violin', 'wallet', 'xmas tree', 'yogurt', 'zip'];
guessed_users=[];
var user_id;

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
      random_word_sign+="_ ";
   }
   io.to(SID[data.User-1]).emit('giveWordS',random_word);

   var socket_t = io.sockets.sockets.get(SID[data.User-1]);
   socket_t.broadcast.emit('giveWordS',random_word_sign);


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
      io.sockets.emit('give_scoreS',g_u);
   }
   guessed_users.length=0;
})
//---------------------------profile page socket work------------------------------------------//
socket.on('getprofiledata', async function () {
   console.log(user_id + "*");
   try {
     const profiled = await profile.findOne({ name: user_id });
     const imageSrc=profiled.profileimg;
     const lgame=profiled.last3game.lastgame;
     const slgame=profiled.last3game.slastgame;
     const tgame=profiled.last3game.tlastgame;
     const lgp=profiled.last3position.lastposition;
     const sgp=profiled.last3position.slastposition;
     const tgp=profiled.last3position.tlastposition;
    console.log(imageSrc);
     socket.emit('setprofiledata', { name: user_id,imageNo:imageSrc, GP: profiled.TotalGP, HS: profiled.HighestScore,lgame:lgame,slgame:slgame,tgame:tgame,lgp:lgp,sgp:sgp,tgp:tgp});
   } catch (error) {
     console.error(error);
   }
 });
//---------------------------profile page data updation--------------------------//
socket.on('updateScore',function(data){
   myMap2.set(data.u,data.value);
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
socket.on("changepic",async function(data){
   console.log(data.user+"*"+data.img);
await profile.updateOne(
   {name:data.user},
   {$set:{'profileimg':Number(data.img)}}

)
})
});

app.use(express.urlencoded({extended:false}))
app.post("/signup", async (req, res) => {
   const data = {
     name: req.body.name,
     password: req.body.password,
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
     if (check && check.password == req.body.password) {
     user_id=req.body.name;
      res.redirect("/HTML/profile.html");
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