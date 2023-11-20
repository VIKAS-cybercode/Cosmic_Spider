var socket=io();
        var user=localStorage.getItem('user-name');
        var guess_word="";
        //---------------/
        
        socket.on('connect',function(){
            var user1=user;
            //myMap.set(socket.id,user1);
            socket.emit('feed-d',{Sid:socket.id,U:user1});
            //console.log(userM);
            //console.log(socket.id+" "+userM);
        })



        /*--------leaderBoard javascript-----*/
        socket.emit('setL',user);
        socket.on('setLead',function(data){
            
            document.getElementById('leaderBoard').innerHTML+='<div class="left-player" id="'+data+'left-player"><div id="'+data+'" class="board-div"><h1 id="player-name">'+data+'       '+'<span id="'+data+'S">' + 0 + '</span>pts</h1></div></div>';
        });
        socket.on('user-disconnected', function(data) {
            console.log('User disconnected: ' + data.SD);
    
            var userElement = document.getElementById(data.usd);
            // Update the HTML as needed
            if (userElement) {
                 document.getElementById(data.usd+'left-player').innerHTML='';
                 console.log(data.usd);
                 document.getElementById('chat-container').innerHTML+='<div class="chat-player-left" style="color:red;">'+data.usd+' left the game!</div>';
            }
        });



        //---------message box javascript/
        
       

        function sendMessage() {
            var message = document.getElementById('message').value;
            
            if (message !== '') {
                document.getElementById('message').value = '';
                socket.emit('msg', { message: message, user: user });
            }
        }
        
        socket.on('newmsg', function (data) {
            if (user) {
                if (data.message !== guess_word) {
                    // Create a new message element
                    var messageElement = document.createElement('div');
                    messageElement.style.color = 'black';
                    messageElement.innerHTML = '<b class="user-message">' + data.user + '</b>: ' + data.message;
        
                    // Append the message to the chat container
                    document.getElementById('chat-container').appendChild(messageElement);
        
                    // Scroll to the bottom of the chat container to show the latest message
                    document.getElementById('chat-container').scrollTop = document.getElementById('chat-container').scrollHeight;
                } else {
                    socket.emit('word_guessC', data.user);
                }
            }
        });

        
        

            socket.on('word_guessS',function(data){
                document.getElementById('chat-container').innerHTML+='<div style="color:green;"><b>'+data+' guessed the word!</b></div>';
            })
            var textBox=document.getElementById("message");
            var buton=document.getElementById("sent");
            textBox.addEventListener("keyup",function(event){
                if(event.key==="Enter"){
                buton.onclick();
                }
            });
            
            


const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 600;
canvas.height = 530;

let context = canvas.getContext("2d");
let start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0,0,canvas.width,canvas.height);

var permission=1;
//socket drawing permission function
socket.on('givepermissionT',function(){
    permission=1;
     turnDraw(); 

})
socket.on('givepermissionNT',function(){
    permission=0;
    console.log("yuta");
   
})

if(permission==1){

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;

// for undo feature
let restore_array = [];
let index1 = -1;

//for redo feature
let redo_array = [];
let index2 = -1;

//to store all closed path for fill feature
let paths = [];
let paths_r = [];

let draw_shape = "pencil";

let current_curser="Curser/pencil.svg";
canvas.style.cursor = 'url(' + current_curser + ') 4 100, auto';

function change_shape(element){
    current_curser="Curser/" + element.id + ".svg";
    canvas.style.cursor = 'url(' + current_curser + '), auto';
    draw_shape = element.id;
    socket.emit("change_shapeC",draw_shape);
}


//to hover the selected shape
document.getElementById("pencil").classList.add("selected");
function change_shape(element){
    draw_shape = element.id;
    let selected_item = document.getElementById(draw_shape);
    let other_items = document.getElementsByClassName("shape-field");
    for(let i = 0; i < other_items.length; i++){
        other_items[i].classList.remove("selected");
    }
    selected_item.classList.add("selected");
}
// function scale_up(element){
//     element.style.height = "60px"; // Increase the height
//     element.style.width = "60px"; // Increase the width
// }

// function scale_down(element){
//     element.style.height = "40px"; // Reset the height to original
//     element.style.width = "40px"; // Reset the width to original
// }


canvas.addEventListener("touchstart",start,false);
canvas.addEventListener("touchmove",draw,false);
canvas.addEventListener("mousedown",start,false);
canvas.addEventListener("mousemove",draw,false);


canvas.addEventListener("touchend",stop,false);
canvas.addEventListener("mouseup",stop,false);
canvas.addEventListener("mouseout",stop,false);


//to stop the default funtion of right click
canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
}, false);


//use wheel to change width
canvas.addEventListener('wheel', function(e) {
    if(e.deltaY < 0)
        draw_width += 2;
    else
        draw_width -= 2;
    
    if(draw_width > 100)
        draw_width = 100;
    //width should not be less then 1
    if(draw_width < 1)
        draw_width = 1;
    e.preventDefault();
    var drawWidth=draw_width;
    socket.emit('wheelC',drawWidth);
}, false);

let mousedown_x, mousedown_y;

//for eraser
let temp_draw_color = ""; // to store the previous draw color
let temp_draw_shape = ""; //to store the previous draw shape


function start(event){
    //for eraser
    if(event.button==2){
        temp_draw_color = draw_color; // Storing the current draw color before changing it to white
        temp_draw_shape = draw_shape; // Storing the current draw color before changing it to white
        draw_color = "white";
        draw_shape = "pencil";
        socket.emit('button2C');
    }
    //coordinates of mousedown
    mousedown_x = event.clientX - canvas.getBoundingClientRect().left;
    mousedown_y = event.clientY - canvas.getBoundingClientRect().top;
    
    
    if(draw_shape=="fill"){
        let insidePath = false;

        for (let path of paths) {
            if (context.isPointInPath(path, mousedown_x, mousedown_y)) {
                // Set the fill color and fill the path
                context.fillStyle = draw_color;
                context.fill(path);
                insidePath = true;
                var p=path;
                socket.emit('fillC1',{Path:p,FillStyle:context.fillStyle});
                break;
            }
        }

        if (!insidePath) {
            context.fillStyle = draw_color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            socket.emit('fillC2',context.fillStyle);
        }

    }
    else{
        is_drawing = true;
        context.beginPath();
        context.moveTo(event.clientX - canvas.getBoundingClientRect().left,
                        event.clientY - canvas.getBoundingClientRect().top);
        var MoveX=event.clientX - canvas.getBoundingClientRect().left;
        var MoveY=event.clientY - canvas.getBoundingClientRect().top;              
        socket.emit('fillC3',{mX:MoveX,mY:MoveY});                
    }   
    
    event.preventDefault();
}

function draw(event){
    // for pencil
    if(is_drawing && draw_shape == "pencil"){
        context.lineTo(event.clientX - canvas.getBoundingClientRect().left,
                        event.clientY - canvas.getBoundingClientRect().top)
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
        var MoveX=event.clientX - canvas.getBoundingClientRect().left;
        var MoveY=event.clientY - canvas.getBoundingClientRect().top;
        socket.emit('drawC',{mX:MoveX,mY:MoveY,StrSyl:context.strokeStyle,LW:context.lineWidth});
    
    }
    event.preventDefault();
}

function stop(event){
    
    //coordinates of mouseup
    let mouseup_x = event.clientX - canvas.getBoundingClientRect().left;
    let mouseup_y = event.clientY - canvas.getBoundingClientRect().top;
    
    //pencil
    if(is_drawing && draw_shape == "pencil"){
        context.stroke();
        context.closePath();
        let path = new Path2D();
        path.moveTo(mousedown_x, mousedown_y);
        path.lineTo(mouseup_x, mouseup_y);
        paths.push(path);
        is_drawing = false;
        var msdx=mousedown_x;
        var msdy=mousedown_y;
        var msux=mouseup_x;
        var msuy=mouseup_y;
        var p=path;
        socket.emit('stopC1',{MDX:msdx,MDY:msdy,MUX:msux,MUY:msuy,Path:p});
    }

    //line
    else if(is_drawing && draw_shape=="line"){
        context.lineTo(mouseup_x,mouseup_y);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
        context.closePath();
        let path = new Path2D();
        path.moveTo(mousedown_x, mousedown_y);
        path.lineTo(mouseup_x, mouseup_y);
        paths.push(path);
        is_drawing = false;
        var mux=mouseup_x;
        var muy=mouseup_y;
        var mdx=mousedown_x;
        var mdy=mousedown_y;
        var lnw=context.lineWidth;
        var p=path;
        socket.emit('stopC2',{MDX:mdx,MDY:mdy,MUX:mux,MUY:muy,LW:lnw,Path:p,StrSyl:context.strokeStyle});

    }
    //Rectangle
    else if(is_drawing && draw_shape=="rectangle"){
        context.rect(mousedown_x, mousedown_y, (mouseup_x - mousedown_x), (mouseup_y - mousedown_y));
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.closePath();
        context.stroke();
        let path = new Path2D();
        path.rect(mousedown_x, mousedown_y, (mouseup_x - mousedown_x), (mouseup_y - mousedown_y));
        paths.push(path);
        is_drawing = false;
        var mux=mouseup_x;
        var muy=mouseup_y;
        var mdx=mousedown_x;
        var mdy=mousedown_y;
        var lnw=context.lineWidth;
        var p=path;
        socket.emit('stopC3',{MDX:mdx,MDY:mdy,MUX:mux,MUY:muy,LW:lnw,Path:p,StrSyl:context.strokeStyle});
        
    }
    //circle
    else if(is_drawing && draw_shape == "circle"){
        let x_r = mousedown_x + (mouseup_x-mousedown_x)/2;
        let y_r = mousedown_y + (mouseup_y-mousedown_y)/2;
        let r = Math.sqrt(Math.pow((mouseup_x-mousedown_x)/2,2) + Math.pow((mouseup_y-mousedown_y)/2,2));
        context.beginPath();
        context.arc(x_r , y_r , r , 0 , 2*Math.PI);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.closePath();
        context.stroke();
        let path = new Path2D();
        path.arc(x_r,y_r,r,0,2*Math.PI);
        paths.push(path);
        is_drawing = false;
        var mux=mouseup_x;
        var muy=mouseup_y;
        var mdx=mousedown_x;
        var mdy=mousedown_y;
        var lnw=context.lineWidth;
        var p=path;
        socket.emit('stopC4',{MDX:mdx,MDY:mdy,MUX:mux,MUY:muy,LW:lnw,Path:p,StrSyl:context.strokeStyle});
        
    }

    //Triangle
    else if(is_drawing && draw_shape == "triangle"){
        context.beginPath();
        context.moveTo(mousedown_x, mousedown_y);
        context.lineTo(mouseup_x, mouseup_y);
        context.lineTo(mousedown_x - (mouseup_x - mousedown_x), mouseup_y);
        context.lineTo(mousedown_x, mousedown_y);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.closePath();
        context.stroke();
        let path = new Path2D();
        path.moveTo(mousedown_x, mousedown_y);
        path.lineTo(mouseup_x, mouseup_y);
        path.lineTo(mousedown_x - (mouseup_x - mousedown_x), mouseup_y);
        path.lineTo(mousedown_x, mousedown_y);
        path.closePath();
        paths.push(path);
        is_drawing = false;
        var mux=mouseup_x;
        var muy=mouseup_y;
        var mdx=mousedown_x;
        var mdy=mousedown_y;
        var lnw=context.lineWidth;
        var p=path;
        socket.emit('stopC5',{MDX:mdx,MDY:mdy,MUX:mux,MUY:muy,LW:lnw,Path:p,StrSyl:context.strokeStyle})
    }

    //for eraser
    if(event.button==2){
        draw_color = temp_draw_color; // to Restore the draw color when right click is released
        draw_shape = temp_draw_shape; // to Restore the draw shape when right click is released
        socket.emit('ErsC',{dc:draw_color,ds:draw_shape});
    }


    event.preventDefault();

    //for undo
    if(event.type!="mouseout"){
        restore_array.push(context.getImageData(0,0,canvas.width,canvas.height));
        index1+=1;
    }
}


//clear button function
function clear_canvas(){
    context.fillStyle = start_background_color;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillRect(0,0,canvas.width,canvas.height);

    restore_array = [];
    index1 = -1;
    redo_array = [];
    index2 = -1;

    paths = [];
    paths_r = [];
    socket.emit('clear_canvasC',{fs:context.fillStyle});
} 
    


//undo button function
function undo_last(){

    if(paths.length>0){
        if(paths[paths.length-1]==restore_array[index1]){
            paths_r.push(paths[paths.length-1]);
            paths.pop();
        }
    }

    if(index1==0){
        index2+=1;
        redo_array[index2] = restore_array[index1];
        index1-=1;
        restore_array.pop();
        clear_canvas();
    }
    else if (index1>0){
        index2+=1;
        redo_array[index2] = restore_array[index1];
        index1-=1;
        restore_array.pop();
        context.putImageData(restore_array[index1],0,0);    
    }

    
    
}

//redo button function
function redo_last(){
    if(paths_r.length>0){
        if(paths_r[paths_r.length-1]==redo_array[index2]){
            paths.push(paths_r[paths_r.length-1]);
            paths_r.pop();
        }
    }

    if(index2>=0){
        index1+=1;
        restore_array[index1]=redo_array[index2];
        index2-=1;
        redo_array.pop();
        context.putImageData(restore_array[index1],0,0);
    }
}
    
}

//undo and redo function are not working for paths array


//to download image
function save_img(element){
    let dataURL = canvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.download = 'my-image.png';
    link.href = dataURL;
    link.click();
}

//socket function

//clear
socket.on('letclean',function(){
    context.clearRect(0,0,canvas.width,canvas.height);
})

//color
socket.on('colorCh',function(data){
     ctx.strokeStyle=data.colorr;
})
//change shape
socket.on('change_shapeS',function(data){
    draw_shape=data;
})
//wheel
socket.on('wheelS',function(data){
    draw_width=data;
})
//button-eraser
socket.on('button2S',function(){
    temp_draw_color = draw_color; 
    temp_draw_shape = draw_shape;
    draw_color = "white";
    draw_shape = "pencil";
})
//fillC1
socket.on('fillS1',function(data){
    context.fillStyle = data.FillStyle;
    context.fill(data.Path);
    //insidePath = true;
})
socket.on('fillS2',function(data){
    context.fillStyle =data;
    context.fillRect(0, 0, canvas.width, canvas.height);
})
socket.on('fillS3',function(data){
    is_drawing = true;
    context.beginPath();
    context.moveTo(data.mX,data.mY);
})
socket.on('drawS',function(data){
    context.lineTo(data.mX,data.mY)
    context.strokeStyle =data.StrSyl;
    context.lineWidth = data.LW;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
})
socket.on('stopS1',function(data){
    context.stroke();
    context.closePath();
    data.Path.moveTo(data.MDX,data.MDY);
    data.Path.lineTo(data.MUX,data.MUY);
    paths.push(data.Path);
    is_drawing = false;
})
socket.on('stopS2',function(data){
    context.lineTo(data.MUX,data.MUY);
    context.strokeStyle =data.StrSyl;
    context.lineWidth =data.LW;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.closePath();
    context.stroke();
    data.Path.moveTo(data.MDX,data.MDY);
    data.Path.lineTo(data.MUX, data.MUY);
    paths.push(data.Path);
    is_drawing = false;
})
socket.on('stopS3',function(data){
    context.rect(data.MDX, data.MDY, (data.MUX - data.MDX), (data.MUY - data.MDY));
    context.strokeStyle = data.StrSyl;
    context.lineWidth =data.LW;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.closePath();
    context.stroke();
    data.Path.rect(data.MDX, data.MDY, (data.MUX - data.MDX), (data.MUY - data.MDY));
    paths.push(data.Path);
    is_drawing = false;
})
socket.on('stopS4',function(data){
    let x_r = data.MDX + (data.MUX-data.MDX)/2;
    let y_r =data.MDY + (data.MUY-data.MDY)/2;
    let r = Math.sqrt(Math.pow((data.MUX-data.MDX)/2,2) + Math.pow((data.MUY-data.MDY)/2,2));
    context.beginPath();
    context.arc(x_r , y_r , r , 0 , 2*Math.PI);
    context.strokeStyle = data.StrSyl;
    context.lineWidth = data.LW;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.closePath();
    context.stroke();
    data.Path.arc(x_r,y_r,r,0,2*Math.PI);
    paths.push(data.Path);
    is_drawing = false;
})
socket.on('stopS5',function(data){
    context.beginPath();
    context.moveTo(data.MDX,data.MDY);
    context.lineTo(data.MUX,data.MUY);
    context.lineTo(data.MDX - (data.MUX - mousedown_x),data.MUY);
    context.lineTo(data.MDX,data.MDY);
    context.strokeStyle = data.StrSyl;
    context.lineWidth = data.LW;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.closePath();
    context.stroke();
    data.Path.moveTo(data.MDX,data.MDY);
    data.Path.lineTo(data.MUX,data.MUY);
    data.Path.lineTo(data.MDX - (data.MUX -data.MDX), data.MUY);
    data.Path.lineTo(data.MDX,data.MDY);
    data.Path.closePath();
    paths.push(data.Path);
    is_drawing = false;
})
socket.on('clear_canvasS',function(data){
    context.fillStyle = data.fs;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillRect(0,0,canvas.width,canvas.height);

    restore_array = [];
    index1 = -1;
    redo_array = [];
    index2 = -1;

    paths = [];
    paths_r = [];
})
socket.on('ErsS',function(data){
    draw_color=data.dc;
    draw_shape=data.ds;
})



let start_time;
let remaining_time = 30;
let n = 0; // replace with the number of users
let timer;

function startTimer() {
    start_time = Date.now();
    let endSound = new Audio('time_up.mp3');
    let tickSound = new Audio('tick_tick.mp3');
    return setInterval(function() {
        let elapsed_time = Math.floor((Date.now() - start_time) / 1000);
        remaining_time = 30 - elapsed_time;
        if (remaining_time <= 0) {
            document.getElementById('clock').innerHTML = 'Time\'s up!';
            endSound.play();
        } else {
            document.getElementById('clock').innerHTML = '<p id="running-time">'+ remaining_time + ' seconds remaining</p>';
            tickSound.play();
        }
    }, 1000);
}

socket.on('socketRoundS', function(data) {
    clearInterval(timer);
    remaining_time = 30;
    document.getElementById('round-number').innerHTML = '<h1 style="color:black;" > Round ' + data.round + ' of 3</h1>';
    timer = startTimer();
});

socket.on('setU_S',function(data){
    n = data;
    console.log(n);
    
})
let completionCounter=0;
function game_start(){
    socket.emit('setU_C');
    for(let i=1; i<=3; i++){        
        for(let user=1; user<=n; user++){
            setTimeout(function() {
                socket.emit('giveWordC',{round :i,User:user});
                socket.emit('socketRoundC',{round:i,User:user}); 
                socket.emit('give_scoreC');
                checkCompletion(); 
            }, (i - 1) * n * remaining_time * 1000 + (user - 1) * remaining_time * 1000);
            socket.emit('givepermissionNTA');
        }
    }
}
function checkCompletion() {
    completionCounter++;

    if (completionCounter === 3 * n) {
      socket.emit('updateprofile');
    }
  }



//-------------------------give word javascript------------------------
socket.on('giveWordS',function(data){
    setTimeout(function(){
        if(data[0]!=='_')
        guess_word=data;

        document.getElementById('new-game').innerHTML='';
        
        document.getElementById('Word').innerHTML='<h1>'+ data + ' </h1>';
        document.getElementById('clock-icon').innerHTML='<i class="fa-regular fa-clock fa-beat fa-2xl" style="color: #ffd700;"></i>';
    },(data.round - 1) * n * remaining_time * 1000 + (data.User - 1) * remaining_time * 1000);
    });

//----------------------score distribution javascript------------------------
socket.on('give_scoreS',function(data){
       var value=Number(document.getElementById(data+'S').innerHTML)+5;
       document.getElementById(data+'S').innerHTML=value;
       socket.emit("updateScore",{u:data,value:value});
})
