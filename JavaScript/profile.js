var socket=io();
var userr;
document.addEventListener('DOMContentLoaded', () => {
  // Fetch user data from the server
  fetch('/getProfileData')
      .then(response => response.json())
      .then(data => {
        userr=data.name;
       // console.log(data);
        document.getElementById('profile').textContent = data.name;
        document.getElementById("profileImage").src ="/media/image"+data.profileimg+ ".jpg"; ;
        document.getElementById("TGP").innerHTML=data.TotalGP;
        document.getElementById("HS").innerHTML=data.HighestScore;
       const lgp=data.last3position.lastposition;
       const sgp=data.last3position.slastposition;
       const tgp=data.last3position.tlastposition;
      // document.getElementById("lgp").innerHTML=lgp;
      // document.getElementById("sgp").innerHTML=sgp;
      // document.getElementById("tgp").innerHTML=tgp;
      const lgame=data.last3game.lastgame;
       const slgame=data.last3game.slastgame;
        const tlgame=data.last3game.tlastgame;

       document.getElementById("lgs").innerHTML=lgame;
       document.getElementById("sgs").innerHTML=slgame;
       document.getElementById("tgs").innerHTML=tlgame;

       document.getElementById("n").value=data.name;
      });
});
function gameEnter(){
  
  socket.emit('id-name',userr);
  console.log("emitted");
  window.location.href = window.location.href + '&?name=' + userr;
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

 

  window.addEventListener('beforeunload', async function (event) {
    // Check if the user is navigating to a different domain
      try {
        // Send an asynchronous request to your server to update online status to 0
        await fetch('/logout', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    
  });

 

