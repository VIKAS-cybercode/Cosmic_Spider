
// Get the pop-up
var popUp = document.getElementById("myPopUp");

// Get the button that opens the pop-up
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the pop-up
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the pop-up 
btn.onclick = function () {
    popUp.style.display = "block";
}

// When the user clicks on <span> (x), close the pop-up
span.onclick = function () {
    popUp.style.display = "none";
}

// When the user clicks anywhere outside of the pop-up, close it
window.onclick = function (event) {
    if (event.target == popUp) {
        popUp.style.display = "none";
    }
}




var socket = io();
function setUsername() {
    if (document.getElementById('name').value == '') {
        alert("please enter a name");
    }
    else {
        socket.emit('setUsername', document.getElementById('name').value);
    }
}

socket.on('user_exist', function (data) {
    document.getElementById('exist-error').innerHTML = data;
});
// socket.on('setUser', function (data) {
//     user = data.username;
    
//     //window.location.href = "/HTML/gamepage.html";
// });




var textBox = document.getElementById("name");
var buton = document.getElementById("work");
textBox.addEventListener("keyup", function (event) {
    if (event.key ==='Enter') {
        buton.onclick();
    }
});



const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.strokeStyle = "#BADA55";
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = 100;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

function draw(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];

    hue++;
    if (hue >= 360) {
        hue = 0;
    }
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    clearCanvas();
});

canvas.addEventListener("mouseout", () => {
    isDrawing = false;
    clearCanvas();
}); 



async function validateForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const name = document.getElementById("name").value;
    const roomName = document.getElementById("Roomname").value;

    if (name === "" || roomName === "") {
        alert("Both fields must be filled out.");
        return false;
    }

    try {
        const response = await fetch('/check-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        const result = await response.json();

        if (result.exists) {
            alert("Name already exists");
            return false;
        } else {
            setUsername();
            // Submit the form programmatically if validation passes
            document.getElementById("gameForm").submit();
        }
    } catch (error) {
        console.error("Error checking name:", error);
        alert("An error occurred while checking the name. Please try again later.");
        return false;
    }
}


