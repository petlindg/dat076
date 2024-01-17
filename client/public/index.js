let parsnipCount = 0;
function parsnipit() {
  var audioPunch = new Audio("./assets/sounds/wilhelm.mp3");
  parsnipCount++;
  var strParsnips = String(parsnipCount) + "&#160;Parsnips";
  document.getElementById("lblParsnips").innerHTML = strParsnips;
  audioPunch.play();
}