var socket=io();
var userr;
document.addEventListener('DOMContentLoaded', () => {
  // Fetch user data from the server
  fetch('/getProfileData')
      .then(response => response.json())
      .then(data => {
        userr=data.name;
        console.log(data);
        document.getElementById('profile').textContent = data.name;
        document.getElementById("profileImage").src ="/media/image"+data.profileimg+ ".jpg"; ;
        document.getElementById("TGP").innerHTML=data.TotalGP;
        document.getElementById("HS").innerHTML=data.HighestScore;
       const lgp=data.last3position.lastposition;
       const sgp=data.last3position.slastposition;
       const tgp=data.last3position.tlastposition;
      document.getElementById("lgp").innerHTML=lgp;
      document.getElementById("sgp").innerHTML=sgp;
      document.getElementById("tgp").innerHTML=tgp;
      const lgame=data.last3game.lastgame;
       const slgame=data.last3game.slastgame;
        const tlgame=data.last3game.tlastgame;

       document.getElementById("lgs").innerHTML=lgame;
       document.getElementById("sgs").innerHTML=slgame;
       document.getElementById("tgs").innerHTML=tlgame;
      });
});
function gameEnter(){
localStorage.setItem('user-name', userr);
socket.emit('id-name',userr);
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
    var user=userr;
    fetch('http://localhost:3212/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name:userr,
        value:imageNo,
      }),
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
    closeForm();
   
  }
