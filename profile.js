var socket=io();
var n;
socket.emit('getname');
socket.on('setname',function(data){
    n=data;
    document.getElementById("profile").innerHTML+=data;
})
function gameEnter(){
localStorage.setItem('user-name', n);
socket.emit('id-name',n);
window.location.href = "gamepage.html";
}