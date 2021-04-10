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
const numberOfPictures = 2;
container.style.marginTop = `60px`;
createIntroPage();
const nextButton = document.querySelector('#next');
let showScores = false;

image.addEventListener("click", onClickImg);
startButton.addEventListener("click", onClickStart);
nextButton.addEventListener("click", onClickNext);
setupMenuButtons();
db.collection("secureGameData").doc("scores")
      .onSnapshot((doc) => {
        const data = doc.data();
        const scores = [];
        const lengths = [];
        for (let i = 0; i < numberOfPictures; i++) {
          lengths.push(data[i].length);
          scores.push(data[i]);
        }
        createScoresPage(scores, lengths);
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
  const username = getUserName();
  addNameToCurrentGame(username);
  image.classList.remove("show");
  gameOver = false;
  hasImageClicked = false;
  destroyTags();
  if (pictureIndex === numberOfPictures - 1) showScores = true
   else {
    pictureIndex++;
    loadPicture();
    resetMenuButtons();
    setupMenuButtons();
   }
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

function addNameToCurrentGame(name) {
  const currentGame = db.collection("games").doc(gameID);
  currentGame
    .update({
      username: name,
    })
    .then(() => {
      console.log(`Username: ${name} has been added to Document with ID: `, gameID);
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
      targetDiv.style.left = `${pos.x}px`;
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
  setUpReadonlyOfInput();
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
  div.style.width = '400px';
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

function setUpReadonlyOfInput() {
  const input = document.querySelector('#name');
  if (pictureIndex === 0) input.removeAttribute('readonly') 
    else input.setAttribute('readonly', true);
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

function getUserName() {
  const input = document.querySelector('#name');
  return input.value;
}

function createScoresPage(scores, lengths) {
  if (!showScores) return
  image.classList.remove('show');
  image.style.position = 'absolute';
  const table = document.createElement('table');
  let tr = document.createElement('tr');
  let th;
  for (let i = 0; i < numberOfPictures; i++) {
    th = document.createElement('th');
    th.textContent = `Picture-${i}`;
    th.setAttribute('colspan', '2');
    tr.appendChild(th);
  }
  table.appendChild(tr);
  const maxLength = lengths.reduce((prev, current) => {
    if (prev > current) return prev
      else return current;
  })
  let score;
  let td;
  for (let row = 0; row < maxLength; row++) {
    tr = document.createElement('tr');
    for (let col = 0; col < numberOfPictures; col++) {
      td = document.createElement('td');
      if (row < lengths[col]) {
        score = scores[col][row];
        td.textContent = score.username;
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = score.time + 's';
      } else {
        td.setAttribute("colspan", "2");
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  container.appendChild(table);
}