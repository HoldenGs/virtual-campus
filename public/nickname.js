let nickname = "";
let nicknameInput = document.getElementById("nickname");

function setNickname() {
  localStorage.clear()
  nickname = nicknameInput.value;
  localStorage.setItem("nickname", nickname);
}

if(nicknameInput){
  nicknameInput.addEventListener("keydown", function(event) {
    event.preventDefault();
    if (event.key === 'ENTER') {
      document.getElementById("go-span").click();
    }
  });
}
