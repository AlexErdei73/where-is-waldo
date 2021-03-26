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
  hit: false,
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
  click.target = target.textContent;
  popupMenu.classList.remove("show");
  hasImageClicked = false;
  addClickToCurrentGame(click);
}

function onClickStart() {
  image.classList.add("show");
  addNewGameToDataBase();
}

function addNewGameToDataBase() {
  db.collection("users")
    .add({
      userName: "Guest",
      starttime: firebase.firestore.FieldValue.serverTimestamp(),
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

function addClickToCurrentGame(click) {
  const currentGame = db.collection("users").doc(userID);
  currentGame
    .update({
      length: firebase.firestore.FieldValue.increment(1),
      clicks: firebase.firestore.FieldValue.arrayUnion(click),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((docRef) => {
      console.log("Document has been updated with ID: ", userID);
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
}
