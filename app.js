var app=require("express")();
var http=require("http").Server(app);
var io=require("socket.io")(http);

var user_n="";
app.get("/",function(req,res){
    res.sendFile(__dirname+"/homePage.html");
});
app.get("/gamepage.html",function(req,res){
   if(user_n){
    res.sendFile(__dirname+"/gamepage.html");
   user_n="";}
});
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/" + "style.css");
  });
app.get('/main.js',function(req,res){
   res.sendFile(__dirname+"/main.js");
})  

users=[];
broadcastt=[];
SID=[];
let myMap1=new Map();
arr1=['bat','play','chalk','car','table','key','football','knife','boat','stage'];
guessed_users=[];

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
   var index1=
   socket.broadcast.emit('user-disconnected', {SD:socket.id,usd:UD});
});
socket.on('feed-d',function(data){
   SID.push(data.Sid);
   console.log("in SID"+data.Sid);
   myMap1.set(data.Sid,data.U);
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
   else{
      //later use this part
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
});
http.listen(3212,function(){
    console.log("server starts--");
});
