var socket=io();
var n;
socket.emit('getprofiledata');
socket.on('setprofiledata',function(data){
    n=data.name;
    console.log(data.GP);
    document.getElementById("profile").innerHTML+=data.name;
    document.getElementById("profileImage").src ="/media/image"+data.imageNo+ ".jpg"; ;
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
window.location.href = "/HTML/gamepage.html";
}
function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
  
  function chooseImage(imageNo) {
    // Replace the current profile image
    document.getElementById("profileImage").src ="/media/image"+imageNo+ ".jpg";
    var user=n;
    socket.emit("changepic",{user:user,img:imageNo})
    closeForm();
   
  }