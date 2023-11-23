var socket=io();
        var user=localStorage.getItem('user-name');
        var guess_word="";
        //---------------/
        
        socket.on('connect',function(){
            var user1=user;
            socket.emit('feed-d',{Sid:socket.id,U:user1});
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
            
            
document.getElementById("d_canvas").style.display = "block";
document.getElementById("g_canvas").style.display = "none";

const d_canvas = document.getElementById("d_canvas");
d_canvas.width = window.innerWidth - 600;
d_canvas.height = 530;

let d_context = d_canvas.getContext("2d");
let start_background_color = "white";
d_context.fillStyle = start_background_color;
d_context.fillRect(0,0,d_canvas.width,d_canvas.height);

const g_canvas = document.getElementById("g_canvas");

g_canvas.width = window.innerWidth - 600;
g_canvas.height = 530;

let g_context = g_canvas.getContext("2d");
g_context.fillStyle = start_background_color;
g_context.fillRect(0,0,g_canvas.width,g_canvas.height);


//variables
let draw_color = "black";
let draw_width = "2";
let is_drawing = false;
let snapshot; 

// for undo feature
let restore_array = [];
restore_array.push(d_context.getImageData(0,0,d_canvas.width,d_canvas.height));
let index1 = 0;

//for redo feature
let redo_array = [];
let index2 = -1;

//to store all closed path for fill feature
let paths = [];
let paths_r = [];

let draw_shape = "pencil";

// let current_curser="/Curser/pencil.svg";
d_canvas.style.cursor = 'url(/Curser/pencil.svg) 4 100, auto';

document.getElementById("pencil").classList.add("selected");

//Change_shape Function
function change_shape(element){
    draw_shape = element.id;
    //to hover the selected shape
    let selected_item = document.getElementById(draw_shape);
    let other_items = document.getElementsByClassName("shape-field");
    for(let i = 0; i < other_items.length; i++){
        other_items[i].classList.remove("selected");
    }
    selected_item.classList.add("selected");

    //Changing Curser
    if(draw_shape==="pencil"){
        d_canvas.style.cursor = 'url(/Curser/' + draw_shape  + '.svg) 4 100, auto';
    }
    else if(draw_shape==="line"){
        d_canvas.style.cursor = 'url(/Curser/' + draw_shape  + '.svg) 14 14, auto';
    }
    else if(draw_shape==="circle"){
        d_canvas.style.cursor = 'url(/Curser/' + draw_shape  + '.svg) 4 4, auto';
    }
    else if(draw_shape==="triangle"){
        d_canvas.style.cursor = 'url(/Curser/' + draw_shape  + '.svg) 4 4, auto';
    }
    else if(draw_shape==="rectangle"){
        d_canvas.style.cursor = 'url(/Curser/' + draw_shape  + '.svg) 2 2, auto';
    }
    else{
        d_canvas.style.cursor = 'url(/Curser/' + draw_shape  + '.svg) 4 4, auto';
    }
    
    socket.emit("change_shapeC",draw_shape);
}


d_canvas.addEventListener("touchstart",start,false);
d_canvas.addEventListener("touchmove",draw,false);
d_canvas.addEventListener("mousedown",start,false);
d_canvas.addEventListener("mousemove",draw,false);


d_canvas.addEventListener("touchend",stop,false);
d_canvas.addEventListener("mouseup",stop,false);
d_canvas.addEventListener("mouseout",stop,false);


//to stop the default funtion of right click
d_canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
}, false);


//use wheel to change width
d_canvas.addEventListener('wheel', function(e) {
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
let mousemove_x, mousemove_y;


//for eraser
let temp_draw_color = ""; // to store the previous draw color
let temp_draw_shape = ""; //to store the previous draw shape
let temp_draw_width = ""; 

//Line--
const drawLine =(event) =>{   
    d_context.beginPath(); 
    d_context.strokeStyle = draw_color;
    d_context.lineWidth = draw_width;
    d_context.lineCap = "round";
    d_context.lineJoin = "round";
    d_context.moveTo(mousedown_x, mousedown_y); 
    d_context.lineTo(event.offsetX, event.offsetY); 
    d_context.closePath();
    d_context.stroke(); 
    var strstyl=d_context.strokeStyle;
    var lw=d_context.lineWidth;
    var mdx=mousedown_x;
    var mdy=mousedown_y;
    var eox=event.offsetX;
    var eoy=event.offsetY;
    socket.emit("drawLineS",{strstyl:strstyl,lw:lw,mdx:mdx,mdy:mdy,eox:eox,eoy:eoy});

   
}
// Rectangle--
const drawRect = (event) => {
    d_context.beginPath();
    d_context.strokeStyle = draw_color;
    d_context.lineWidth = draw_width;
    d_context.lineCap = "round";
    d_context.lineJoin = "round";
    d_context.rect(event.offsetX, event.offsetY, mousedown_x - event.offsetX, mousedown_y - event.offsetY); 
    d_context.closePath();
    d_context.stroke();
    var strstyl=d_context.strokeStyle;
    var lw=d_context.lineWidth;
    var mdx=mousedown_x;
    var mdy=mousedown_y;
    var eox=event.offsetX;
    var eoy=event.offsetY;
    socket.emit("drawRectS",{strstyl:strstyl,lw:lw,mdx:mdx,mdy:mdy,eox:eox,eoy:eoy});
}
// Circle--
const drawCircle = (event) => {
    d_context.beginPath();
    let radius = Math.sqrt(Math.pow((mousedown_x - event.offsetX), 2) + Math.pow((mousedown_y - event.offsetY), 2));
    d_context.arc(mousedown_x, mousedown_y, radius, 0, 2 * Math.PI); 
    d_context.strokeStyle = draw_color;
    d_context.lineWidth = draw_width;
    d_context.lineCap = "round";
    d_context.lineJoin = "round";
    d_context.stroke();
    d_context.closePath();
    var strstyl=d_context.strokeStyle;
    var lw=d_context.lineWidth;
    var mdx=mousedown_x;
    var mdy=mousedown_y;
    socket.emit("drawCircleS",{strstyl:strstyl,lw:lw,mdx:mdx,mdy:mdy,radius:radius});

}
//Triangle--
const drawTriangle = (event) => {
    d_context.beginPath();
    d_context.strokeStyle = draw_color;
    d_context.lineWidth = draw_width;
    d_context.lineCap = "round";
    d_context.lineJoin = "round";
    d_context.moveTo(mousedown_x, mousedown_y); 
    d_context.lineTo(event.offsetX, event.offsetY); 
    d_context.lineTo(mousedown_x * 2 - event.offsetX, event.offsetY); 
    d_context.closePath(); 
    d_context.stroke(); 
    var strstyl=d_context.strokeStyle;
    var lw=d_context.lineWidth;
    var mdx=mousedown_x;
    var mdy=mousedown_y;
    var eox=event.offsetX;
    var eoy=event.offsetY;
    socket.emit("drawTriangleS",{strstyl:strstyl,lw:lw,mdx:mdx,mdy:mdy,eox:eox,eoy:eoy});
}



function start(event){
    //for eraser
    if(event.button==2){
        temp_draw_color = draw_color; // Storing the current draw color before changing it to white
        temp_draw_shape = draw_shape; // Storing the current draw color before changing it to white
        temp_draw_width = draw_width;
        draw_color = "white";
        draw_shape = "pencil";
        draw_width = 15;
        d_canvas.style.cursor = 'url(/Curser/eraser-solid.svg) 10 20, pointer';
        socket.emit('button2C');
    }
    //coordinates of mousedown
    mousedown_x = event.clientX - d_canvas.getBoundingClientRect().left;
    mousedown_y = event.clientY - d_canvas.getBoundingClientRect().top;
    
    //to fill color
    if(draw_shape=="fill"){
        let insidePath = false;
        // floodFill(mousedown_x,mousedown_y,draw_color);
        
        for (let path of paths) {
            if (d_context.isPointInPath(path, mousedown_x, mousedown_y)) {
                // Set the fill color and fill the path
                d_context.fillStyle = draw_color;
                d_context.fill(path);
                insidePath = true;
                var p=path;
                socket.emit('fillC1',{Pth:p,FillStyle:draw_color});
                break;
            }
            
        }

        if (!insidePath) {
            d_context.fillStyle = draw_color;
            d_context.fillRect(0, 0, d_canvas.width, d_canvas.height);
            socket.emit('fillC2',d_context.fillStyle);
        }

    }
    else{
        is_drawing = true;
        d_context.beginPath();
        d_context.moveTo(event.clientX - d_canvas.getBoundingClientRect().left,
                        event.clientY - d_canvas.getBoundingClientRect().top);
        var MoveX=event.clientX - d_canvas.getBoundingClientRect().left;
        var MoveY=event.clientY - d_canvas.getBoundingClientRect().top;              
        socket.emit('fillC3',{mX:MoveX,mY:MoveY});                
        snapshot = d_context.getImageData(0, 0, d_canvas.width, d_canvas.height);
    }   
    
    event.preventDefault();
}

function draw(event){
    if(!is_drawing) return;

    //coordinates of mousemove
    mousemove_x = event.clientX - d_canvas.getBoundingClientRect().left;
    mousemove_y = event.clientY - d_canvas.getBoundingClientRect().top;

    // for pencil
    if(draw_shape == "pencil"){
        d_context.lineTo(mousemove_x,mousemove_y);
        d_context.strokeStyle = draw_color;
        d_context.lineWidth = draw_width;
        d_context.lineCap = "round";
        d_context.lineJoin = "round";
        d_context.stroke();
        var MoveX=mousemove_x;
        var MoveY=mousemove_y;
        socket.emit('drawC',{mX:MoveX,mY:MoveY,StrSyl:d_context.strokeStyle,LW:d_context.lineWidth});
    }

    else if(draw_shape == "line"){
        let s = {
            data: Array.from(snapshot.data),
            width: snapshot.width,
            height: snapshot.height
        };
        d_context.putImageData(snapshot, 0, 0);
        socket.emit("lineExS",s);
        drawLine(event);
    }
    else if(draw_shape == "rectangle"){
        let s = {
            data: Array.from(snapshot.data),
            width: snapshot.width,
            height: snapshot.height
        };
        d_context.putImageData(snapshot, 0, 0);
        socket.emit("RectExS",s);
        drawRect(event);
    }
    else if(draw_shape == "circle"){
        let s = {
            data: Array.from(snapshot.data),
            width: snapshot.width,
            height: snapshot.height
        };
        d_context.putImageData(snapshot, 0, 0);
        socket.emit("CircleExS",s);
        drawCircle(event);
    }
    else if(draw_shape == "triangle"){
        let s = {
            data: Array.from(snapshot.data),
            width: snapshot.width,
            height: snapshot.height
        };
        d_context.putImageData(snapshot, 0, 0);
        socket.emit("TriangleExS",s);
        drawTriangle(event);
    }

    event.preventDefault();
}

function stop(event){
    
    //coordinates of mouseup
    let mouseup_x = event.clientX - d_canvas.getBoundingClientRect().left;
    let mouseup_y = event.clientY - d_canvas.getBoundingClientRect().top;
    
    //pencil
    if(is_drawing && draw_shape == "pencil"){
        d_context.stroke();
        d_context.closePath();
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
        let path = new Path2D();
        path.moveTo(mousedown_x, mousedown_y);
        path.lineTo(mouseup_x, mouseup_y);
        paths.push(path);
        is_drawing = false;
        var mux=mouseup_x;
        var muy=mouseup_y;
        var mdx=mousedown_x;
        var mdy=mousedown_y;
        var p=path;
        socket.emit('stopC2',{MDX:mdx,MDY:mdy,MUX:mux,MUY:muy,Path:p});

    }
    //Rectangle
    else if(is_drawing && draw_shape=="rectangle"){
        let path = new Path2D();
        path.rect(mousedown_x, mousedown_y, (mouseup_x - mousedown_x), (mouseup_y - mousedown_y));
        paths.push(path);
        is_drawing = false;
        var mux=mouseup_x;
        var muy=mouseup_y;
        var mdx=mousedown_x;
        var mdy=mousedown_y;
        var p=path;
        socket.emit('stopC3',{MDX:mdx,MDY:mdy,MUX:mux,MUY:muy,Path:p});
        
    }
    //circle
    else if(is_drawing && draw_shape == "circle"){
        let path = new Path2D();
        let radius = Math.sqrt(Math.pow((mousedown_x - mouseup_x), 2) + Math.pow((mousedown_y - mouseup_y), 2));
        path.arc(mousedown_x, mousedown_y, radius, 0, 2 * Math.PI);
        paths.push(path);
        is_drawing = false;
        var p=path;
        var r=radius;
        var mdx=mousedown_x;
        var mdy=mousedown_y;
          
        socket.emit('stopC4',{Path:p,radius:r,MDX:mdx,MDY:mdy});
          
    }

    //Triangle
    else if(is_drawing && draw_shape == "triangle"){
        let path = new Path2D();
        path.moveTo(mousedown_x, mousedown_y); 
        path.lineTo(mouseup_x, mouseup_y); 
        path.lineTo(mousedown_x * 2 - mouseup_x, mouseup_y);
        path.closePath();
        paths.push(path);
        is_drawing = false;
        var mux=mouseup_x;
        var muy=mouseup_y;
        var mdx=mousedown_x;
        var mdy=mousedown_y;
        var p=path;
        socket.emit('stopC5',{MDX:mdx,MDY:mdy,MUX:mux,MUY:muy,Path:p})
    }

    //for eraser
    if(event.button==2){
        draw_color = temp_draw_color; // to Restore the draw color when right click is released
        draw_shape = temp_draw_shape; // to Restore the draw shape when right click is released
        draw_width = temp_draw_width;
        d_canvas.style.cursor = 'url(/Curser/'+ draw_shape +'.svg) 4 100, auto';
        socket.emit('ErsC',{dc:draw_color,ds:draw_shape});
    }


    event.preventDefault();

    //for undo
    if(event.type!="mouseout"){
        restore_array.push(d_context.getImageData(0,0,d_canvas.width,d_canvas.height));
        index1+=1;
    }
}


//clear button function
function clear_canvas(){ //not  changed canvas
    d_context.fillStyle = start_background_color;
    d_context.clearRect(0,0,d_canvas.width,d_canvas.height);
    d_context.fillRect(0,0,d_canvas.width,d_canvas.height);

    restore_array = [];
    restore_array.push(d_context.getImageData(0,0,d_canvas.width,d_canvas.height));
    index1 = 0;
    redo_array = [];
    index2 = -1;

    paths = [];
    paths_r = [];
    socket.emit('clear_canvasC',{fs:d_context.fillStyle});
} 
    


//undo button function
function undo_last(){

    if(paths.length>0){
        if(paths[paths.length-1]==restore_array[index1]){
            paths_r.push(paths[paths.length-1]);
            paths.pop();
            var p=paths[paths.length-1];
        }
    }
    if(index1>0){
        index2+=1;
        redo_array[index2] = restore_array[index1];
        index1-=1;
        restore_array.pop();
        d_context.putImageData(restore_array[index1],0,0);
        let s = {
            data: Array.from(restore_array[index1].data),
            width: restore_array[index1].width,
            height: restore_array[index1].height
        };
        socket.emit("UndoC",s);

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
        d_context.putImageData(restore_array[index1],0,0);
        let s = {
            data: Array.from(restore_array[index1].data),
            width: restore_array[index1].width,
            height: restore_array[index1].height
        };
        socket.emit("RedoC",s);
    }
}
    
// }

//undo and redo function are not working for paths array


//to download image
function save_img(element){
    let dataURL = d_canvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.download = 'my-image.png';
    link.href = dataURL;
    link.click();
}

//socket function

//clear

socket.on('letclean',function(){
    g_context.clearRect(0,0,g_canvas.width,g_canvas.height);
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
    draw_width = 15;
})
//fillC1
socket.on('fillS1',function(data){
    console.log("s1 called");
    g_context.fillStyle = data.FillStyle;
    g_context.fill(data.Path);
    
})
socket.on('fillS2',function(data){
    console.log("s2 called");
    g_context.fillStyle =data;
    g_context.fillRect(0, 0, g_canvas.width, g_canvas.height);
})
socket.on('fillS3',function(data){
    g_context.beginPath();
    g_context.moveTo(data.mX,data.mY);
})
socket.on('drawS',function(data){
    g_context.lineTo(data.mX,data.mY)
    g_context.strokeStyle =data.StrSyl;
    g_context.lineWidth = data.LW;
    g_context.lineCap = "round";
    g_context.lineJoin = "round";
    g_context.stroke();
})
socket.on('stopS1',function(data){
    g_context.stroke();
    g_context.closePath();
    data.Path.moveTo(data.MDX,data.MDY);
    data.Path.lineTo(data.MUX,data.MUY);
    paths.push(data.Path);
    is_drawing = false;
})
socket.on('stopS2',function(data){
    data.Path.moveTo(data.MDX, data.MDY);
        data.Path.lineTo(data.MUX,data.MUY);
        paths.push(data.Path);
        is_drawing = false;
})
socket.on('stopS3',function(data){
    data.Path.rect(data.MDX, data.MDY, (data.MUX-data.MDX), (data.MUY-data.MDY));
        paths.push(data.Path);
        is_drawing = false;
})
socket.on('stopS4',function(data){
    data.Path.arc(data.MDX,data.MDY, data.radius, 0, 2 * Math.PI);
        paths.push(data.Path);
        is_drawing = false;
})
socket.on('stopS5',function(data){
    data.Path.moveTo(data.MDX, data.MDY); 
    data.Path.lineTo(data.MUX,data.MUY); 
    data.Path.lineTo(data.MDX * 2 - data.MUX, data.MUY);
    data.Path.closePath();
    paths.push(data.Path);
    is_drawing = false;
})
socket.on('clear_canvasS',function(data){
    g_context.fillStyle = data.fs;
    g_context.clearRect(0,0,g_canvas.width,g_canvas.height);
    g_context.fillRect(0,0,g_canvas.width,g_canvas.height);

})

socket.on("UndoS",function(s){
    console.log("undo called");
    let snapshot = new ImageData(new Uint8ClampedArray(s.data), s.width, s.height);
       g_context.putImageData(snapshot,0,0);
})
socket.on("RedoS",function(s){
    console.log("redo called");
    let snapshot = new ImageData(new Uint8ClampedArray(s.data), s.width, s.height);
    g_context.putImageData(snapshot,0,0);
})
socket.on('ErsS',function(data){
    draw_color=data.dc;
    draw_shape=data.ds;
})

socket.on("drawLineC",function(data){
    g_context.beginPath(); 
    g_context.strokeStyle = data.strstyl;
    g_context.lineWidth = data.lw;
    g_context.lineCap = "round";
    g_context.lineJoin = "round";
    g_context.moveTo(data.mdx, data.mdy); 
    g_context.lineTo(data.eox,data.eoy); 
    g_context.closePath();
    g_context.stroke(); 
})
socket.on("lineExC",function(s){
    console.log("function work");
    let snapshot = new ImageData(new Uint8ClampedArray(s.data), s.width, s.height);
    g_context.putImageData(snapshot, 0, 0);
})
socket.on("drawRectC",function(data){
    g_context.beginPath();
    g_context.strokeStyle = data.strstyl;
    g_context.lineWidth = data.lw;
    g_context.lineCap = "round";
    g_context.lineJoin = "round";
    g_context.rect(data.eox, data.eoy, data.mdx-data.eox, data.mdy-data.eoy); 
    g_context.closePath();
    g_context.stroke(); 
})
socket.on("RectExC",function(s){
    console.log("function work");
    let snapshot = new ImageData(new Uint8ClampedArray(s.data), s.width, s.height);
    g_context.putImageData(snapshot, 0, 0);
})
socket.on("drawCircleC",function(data){
    g_context.beginPath();
    let radius = data.radius;
    g_context.arc(data.mdx, data.mdy, radius, 0, 2 * Math.PI); 
    g_context.strokeStyle = data.strstyl;
    g_context.lineWidth = data.lw;
    g_context.lineCap = "round";
    g_context.lineJoin = "round";
    g_context.stroke();
    g_context.closePath();
})
socket.on("CircleExC",function(s){
    console.log("function work");
    let snapshot = new ImageData(new Uint8ClampedArray(s.data), s.width, s.height);
    g_context.putImageData(snapshot, 0, 0);
})
socket.on("drawTriangleC",function(data){
    g_context.beginPath();
    g_context.strokeStyle = data.strstyl;
    g_context.lineWidth = data.lw;
    g_context.lineCap = "round";
    g_context.lineJoin = "round";
    g_context.moveTo(data.mdx,data.mdy); 
    g_context.lineTo(data.eox,data.eoy); 
    g_context.lineTo(data.mdx * 2 - data.eox, data.eoy); 
    g_context.closePath(); 
    g_context.stroke(); 
})
socket.on("TriangleExC",function(s){
    console.log("function work t");
    let snapshot = new ImageData(new Uint8ClampedArray(s.data), s.width, s.height);
    g_context.putImageData(snapshot, 0, 0);
})





let start_time;
let remaining_time = 30;
let n = 0; // replace with the number of users
let timer;

function startTimer() {
    start_time = Date.now();
    let endSound = new Audio('/media/time_up.mp3');
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
        if(data[0]!=='_'){
        guess_word=data;
        document.getElementById("d_canvas").style.display = "block";
        document.getElementById("g_canvas").style.display = "none";
        d_context.clearRect(0,0,d_canvas.width,d_canvas.height);
        d_context.fillRect(0,0,d_canvas.width,d_canvas.height);
        restore_array = [];
        restore_array.push(d_context.getImageData(0,0,d_canvas.width,d_canvas.height));
        index1 = 0;
        redo_array = [];
        index2 = -1;
    
        paths = [];
        paths_r = [];
        draw_shape="pencil";
        d_canvas.style.cursor = 'url(/Curser/pencil.svg) 4 100, auto';
        let other_items = document.getElementsByClassName("shape-field");
        for(let i = 0; i < other_items.length; i++){
        other_items[i].classList.remove("selected");
        }
        document.getElementById("pencil").classList.add("selected");
        
        }
        else{
            document.getElementById("d_canvas").style.display = "none";
            document.getElementById("g_canvas").style.display = "block";
            g_context.clearRect(0,0,g_canvas.width,g_canvas.height);
            g_context.fillRect(0,0,g_canvas.width,g_canvas.height);  
            
        }

        
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

var audio = document.getElementById("myAudio");
var audioIcon = document.getElementById("audioIcon");

function toggleAudio() {
    if (audio.paused) {
        audio.play();
        audioIcon.className = "fa-solid fa-volume-high fa-xl";
    } else {
        audio.pause();
        audioIcon.className = "fa-solid fa-volume-xmark fa-xl";
    }
}


