const container = document.querySelector(".picture-container");
const image = document.querySelector("#game-hero");
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
let pictureIndex = 0;
const shiftRight = (() => {
  const marginLeft = getComputedStyle(container)["margin-left"];
  const indexOfPx = marginLeft.indexOf('px');
  return Number(marginLeft.slice(0, indexOfPx));
})();
const shiftDown = 60;
container.style.marginTop = `${shiftDown}px`;
createIntroPage();
const nextButton = document.querySelector('#next');

image.addEventListener("click", onClickImg);
startButton.addEventListener("click", onClickStart);
nextButton.addEventListener("click", onClickNext);
setupMenuButtons();

function onClickImg(event) {
  if (hasImageClicked || gameOver) return;
  const x = event.layerX;
  const y = event.layerY;
  console.log({ x, y });
  click.x = x;
  click.y = y;
  popupMenu.classList.add("show");
  popupMenu.style.top = `${y + shiftDown - borderHeight / 2}px`;
  popupMenu.style.left = `${x + shiftRight - borderWidth / 2}px`;
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

function loadPicture() {
  const waldoPictures = [
    'pictures/waldo-1.jpg',
    'pictures/waldo-2.jpg',
  ]
  storageRef.child(waldoPictures[pictureIndex]).getDownloadURL()
    .then((url) => {
      image.src = url;
      image.classList.add("show");
      addNewGameToDataBase();
    });
}

function onClickStart() {
  startButton.style.visibility = 'hidden';
  destroyIntroPage();
  loadPicture(); 
}

function onClickNext() {
  hideModal();
  image.classList.remove("show");
  pictureIndex += 1;
  gameOver = false;
  hasImageClicked = false;
  if (pictureIndex === 2) pictureIndex = 0;
  loadPicture();
  destroyTags();
  resetMenuButtons();
  setupMenuButtons();
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
      targetDiv.style.top = `${pos.y + shiftDown}px`;
      targetDiv.style.left = `${pos.x + shiftRight}px`;
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
  const text = `You have found everybody in ${time}s`;
  setModalBodyText(text);
  showModal();
  gameOver = true;
}

function createIntroPage() {
  const introduction1 = `Let me itroduce you Waldo and his friends:`
  const pElement1 = document.createElement('p');
  pElement1.textContent = introduction1;
  pElement1.style.fontSize = '21px';
  pElement1.style.width = '600px';
  pElement1.style.margin = '20px auto';
  container.appendChild(pElement1);
  const figures = [
    'assets/waldo.jpg',
    'assets/odlaw.jpg',
    'assets/wizzard.jpeg',
    'assets/wenda.jpeg',
  ];
  const names = [
    'waldo',
    'odlaw',
    'wizzard',
    'wenda',
  ]
  let imgElement;
  const div = document.createElement('div');
  div.style.width = '600px';
  div.style.margin = 'auto';
  div.id = 'characters';
  container.appendChild(div);
  for (let i = 0; i < 4; i++) {
    imgElement = document.createElement('img');
    imgElement.src = figures[i];
    imgElement.style.width = '50px';
    imgElement.style.opacity = 1;
    imgElement.style.margin = '20px';
    div.appendChild(imgElement);
  }
  emptyDiv = document.createElement('div');
  div.appendChild(emptyDiv);
  for (let i = 0; i < 4; i++) {
    nameElement = document.createElement('div');
    nameElement.textContent = names[i];
    nameElement.style.width = '50px';
    nameElement.style.display = 'inline';
    nameElement.style.margin = '20px';
    div.appendChild(nameElement);
  }
  const introduction2 = `Your task is finding them on the pictures by 
  clicking the right place on the picture. The program measures your
  time, the faster you can find them, the better. Are you ready? 
  Press the button!`
  const pElement2 = document.createElement('p');
  pElement2.textContent = introduction2;
  pElement2.style.fontSize = '21px';
  pElement2.style.width = '600px';
  pElement2.style.margin = '20px auto';
  container.appendChild(pElement2);
}

function destroyIntroPage() {
  const pElements = container.querySelectorAll('p');
  pElements.forEach(item => item.remove());
  const div = container.querySelector('#characters');
  div.remove();
}

function showModal() {
  const modal = document.querySelector('.modal');
  modal.style.visibility = 'visible';
  const modalContent = document.querySelector('.modal-content');
  modalContent.classList.replace('hide-modal','show-modal');
}

function hideModal() {
  const modal = document.querySelector('.modal');
  modal.style.visibility = 'hidden';
  const modalContent = document.querySelector('.modal-content');
  modalContent.classList.replace('show-modal','hide-modal');
}

function setModalBodyText(text) {
  const modalBody = document.querySelector('.modal-body');
  const pElement = modalBody.querySelector('p');
  pElement.textContent = text;
}

function destroyTags() {
  const container = document.querySelector(".picture-container");
  const tags = document.querySelectorAll(".tag");
  tags.forEach(element => element.remove());
}

function resetMenuButtons() {
  menuButtons.forEach(button => {
    button.removeEventListener("click", onClickBtn);
    button.removeAttribute('disabled');
    button.style = '';
  })
}

function setupMenuButtons() {
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
}