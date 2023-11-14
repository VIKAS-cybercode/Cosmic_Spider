
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 575;
canvas.height = 500;

let context = canvas.getContext("2d");
let start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0,0,canvas.width,canvas.height);



let draw_color = "#000";
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

// ---change----
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
                break;
            }
        }

        if (!insidePath) {
            context.fillStyle = draw_color;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

    }
    else{
        is_drawing = true;
        context.beginPath();
        context.moveTo(event.clientX - canvas.getBoundingClientRect().left,
                        event.clientY - canvas.getBoundingClientRect().top);
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
    }

    //line
    else if(is_drawing && draw_shape=="line"){
        context.lineTo(mouseup_x,mouseup_y);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.closePath();
        context.stroke();
        let path = new Path2D();
        path.moveTo(mousedown_x, mousedown_y);
        path.lineTo(mouseup_x, mouseup_y);
        paths.push(path);
        is_drawing = false;
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
    }
    //circle
    else if(is_drawing && draw_shape == "circle"){
        let x_r = mousedown_x + (mouseup_x-mousedown_x)/2;
        let y_r = mousedown_y + (mouseup_y-mousedown_y)/2;
        let r = Math.sqrt(Math.pow((mouseup_x-mousedown_x)/2,2) + Math.pow((mouseup_y-mousedown_y)/2,2));
        context.beginPath();
        context.arc(x_r,y_r,r,0,2*Math.PI);
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
    }

    //for eraser
    if(event.button==2){
        draw_color = temp_draw_color; // to Restore the draw color when right click is released
        draw_shape = temp_draw_shape; // to Restore the draw shape when right click is released
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

//undo and redo function are not working for paths array

//-------change------
function save_img(element){
    let dataURL = canvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.download = 'my-image.png';
    link.href = dataURL;
    link.click();
}

