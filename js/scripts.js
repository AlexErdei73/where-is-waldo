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
let gameID;
const storageRef = storage.ref();

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
  storageRef.child('pictures/waldo-1.jpg').getDownloadURL()
    .then((url) => {
      image.src = url;
      image.classList.add("show");
      addNewGameToDataBase();
    }); 
}

function addNewGameToDataBase() {
  db.collection("games")
    .add({
      clicks: [],
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      gameID = docRef.id;
      db.collection("secretGameData").doc(gameID)
      .set({
        hit: false,
        startTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        position: position,
      })
      .then(() => {
        db.collection("secretGameData").doc(gameID)
        .onSnapshot((doc) => {
          const data = doc.data();
          const target = data.target;
          if (!target) return
          if (data.hit) console.log(`${data.target} was hit`)
            else console.log(`${data.target} was missed`);
        });
      })
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function addClickToCurrentGame(click) {
  const currentGame = db.collection("games").doc(gameID);
  currentGame
    .update({
      clicks: firebase.firestore.FieldValue.arrayUnion(click),
    })
    .then(() => {
      console.log("Document has been updated with ID: ", gameID);
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
}