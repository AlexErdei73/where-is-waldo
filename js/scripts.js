const image = document.querySelector("img");
const popupMenu = document.querySelector(".popup-menu");
const menuButtons = document.querySelectorAll(".choice");
const startButton = document.querySelector("#start");
const borderWidth = 30;
const borderHeight = 60;
let hasImageClicked = false;
const click = {
  x: 0,
  y: 0,
  target: "",
};
let userID;

image.addEventListener("click", onClickImg);
menuButtons.forEach((button) => {
  button.addEventListener("click", onClickBtn);
});
startButton.addEventListener("click", onClickStart);

function onClickImg(event) {
  if (hasImageClicked) return;
  const x = event.layerX;
  const y = event.layerY;
  console.log({ x, y });
  click.x = x;
  click.y = y;
  popupMenu.classList.add("show");
  popupMenu.style.top = `${y - borderHeight / 2}px`;
  popupMenu.style.left = `${x - borderWidth / 2}px`;
  hasImageClicked = true;
}

function onClickBtn(event) {
  const target = event.target;
  console.log(target.textContent);
  click.target = target;
  popupMenu.classList.remove("show");
  hasImageClicked = false;
}

function onClickStart() {
  image.classList.add("show");
  addNewGameToDataBase();
}

function addNewGameToDataBase() {
  db.collection("users")
    .add({
      userName: "Guest",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      length: 0,
      clicks: [],
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      userID = docRef.id;
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function addClickToCurrentGame(click) {}
