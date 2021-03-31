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
let gameID;

const position = {
  waldo: {
    xmin: 529,
    xmax: 559,
    ymin: 355,
    ymax: 415,
  },
  odlaw: {
    xmin: 235,
    xmax: 265,
    ymin: 364,
    ymax: 424,
  },
  wizzard: {
    xmin: 629,
    xmax: 659,
    ymin: 360,
    ymax: 420,
  },
};

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
  db.collection("games")
    .add({
      userName: "Guest",
      starttime: firebase.firestore.FieldValue.serverTimestamp(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      length: 0,
      isHitChecked: false,
      clicks: [],
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      gameID = docRef.id;
      db.collection('games').doc(gameID)
        .onSnapshot((doc) => {
          console.log(doc.data());
          if (!doc.data().isHitChecked) return
          const click = doc.data().clicks[doc.data().length - 1];
          if (click.hit) console.log(`${click.target} was hit`)
            else console.log(`${click.target} was missed`);
        });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function addClickToCurrentGame(click) {
  const currentGame = db.collection("games").doc(gameID);
  currentGame
    .update({
      length: firebase.firestore.FieldValue.increment(1),
      isHitChecked: false,
      clicks: firebase.firestore.FieldValue.arrayUnion(click),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log("Document has been updated with ID: ", gameID);
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
}