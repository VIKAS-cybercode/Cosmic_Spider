var socket=io();
var n;
socket.emit('getprofiledata');
socket.on('setprofiledata',function(data){
    n=data.name;
    console.log(data.GP);
    document.getElementById("profile").innerHTML+=data.name;
    document.getElementById("TGP").innerHTML+=data.GP;
    document.getElementById("HS").innerHTML+=data.HS;
    document.getElementById("lgp").innerHTML+=data.lgp;
    document.getElementById("sgp").innerHTML+=data.sgp;
    document.getElementById("tgp").innerHTML+=data.tgp;
    document.getElementById("lgs").innerHTML+=data.lgame;
    document.getElementById("sgs").innerHTML+=data.slgame;
    document.getElementById("tgs").innerHTML+=data.tgame;
    
})
function gameEnter(){
localStorage.setItem('user-name', n);
socket.emit('id-name',n);
window.location.href = "gamepage.html";
}
