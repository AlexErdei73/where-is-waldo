const container = document.querySelector(".picture-container");
const image = document.querySelector("img");
const popupMenu = document.querySelector(".popup-menu");
const menuButtons = document.querySelectorAll(".choice");
const startButton = document.querySelector("#start");
const borderWidth = 30;
const borderHeight = 60;
let hasImageClicked = false;
let gameOver = false;
const click = {
  x: 0,
  y: 0,
  target: "",
};
let gameID;
const storageRef = storage.ref();
const pictureIndex = 1;
const shift = (() => {
  const marginLeft = getComputedStyle(container)["margin-left"];
  const indexOfPx = marginLeft.indexOf('px');
  return Number(marginLeft.slice(0, indexOfPx));
})();
const introduction = `Your task is to click on the picture to find Waldo, Odlaw and the
Wizzard. If you ready to start press the button!`
const pElement = document.createElement('p');
pElement.textContent = introduction;
container.appendChild(pElement);

image.addEventListener("click", onClickImg);
startButton.addEventListener("click", onClickStart);
db.collection("secureGameData").doc("pictureInfo").get()
  .then((doc) => {
    const numberOfCharacters = doc.data().numbersOfCharacters[pictureIndex];
    menuButtons.forEach((button, index) => {
      button.addEventListener("click", onClickBtn);
      if (index >= numberOfCharacters) { 
        button.setAttribute("disabled", true); 
        button.style.opacity = 0;
        if (numberOfCharacters === 4) button.style.heigth = '16px';
      }
    });
  });

function onClickImg(event) {
  if (hasImageClicked || gameOver) return;
  const x = event.layerX;
  const y = event.layerY;
  console.log({ x, y });
  click.x = x;
  click.y = y;
  popupMenu.classList.add("show");
  popupMenu.style.top = `${y - borderHeight / 2}px`;
  popupMenu.style.left = `${x + shift - borderWidth / 2}px`;
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
  const waldoPictures = [
    'pictures/waldo-1.jpg',
    'pictures/waldo-2.jpg',
  ]
  startButton.style.visibility = 'hidden';
  pElement.remove();
  storageRef.child(waldoPictures[pictureIndex]).getDownloadURL()
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
      pictureIndex: pictureIndex,
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      gameID = docRef.id;
        
      db.collection("secureGameData").doc(gameID)
      .onSnapshot((doc) => {
        const data = doc.data();
        if (!data) return
        const target = data.target;
        if (!target) return
        if (data.hit) { 
          createTag(target);
          handleGameOver(data);
        }
          else console.log(`${target} was missed`);
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
      clicks: firebase.firestore.FieldValue.arrayUnion(click),
    })
    .then(() => {
      console.log("Document has been updated with ID: ", gameID);
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
}

function createTag(target) {
  const container = document.querySelector(".picture-container");
  const tags = Array.from(document.querySelectorAll(".tag"));
  const targets = tags.map(tag => tag.getAttribute("target"));
  if (targets.indexOf(target) !== -1) return
  const targetDiv = document.createElement("div");
  targetDiv.setAttribute("target", target);
  targetDiv.textContent = target;
  targetDiv.classList.add("tag");
  getTagPosition(pictureIndex, target)
    .then((pos) => {
      targetDiv.style.top = `${pos.y}px`;
      targetDiv.style.left = `${pos.x + shift}px`;
      container.appendChild(targetDiv);
    });
}

function getTagPosition(pictureIndex, target) {
  return db.collection("secureGameData").doc("pictureInfo").get()
    .then((doc) => {
      const positions = doc.data().positions;
      const position = positions[pictureIndex][target];
      const x = Math.round((position.xmin + position.xmax) / 2);
      const y = Math.round((position.ymin + position.ymax) / 2);
      return { x, y };
    });
}

function handleGameOver(data) {
  const isGameOver = data.isGameOver;
  if (!isGameOver) return
  const time = data.time;
  if (!time) return
  console.log(`GAME OVER, time = ${time}s`);
  gameOver = true;
}