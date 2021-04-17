import { handleGameOver, pictureIndex,  image, numberOfPictures } from './index';
import { createScoresPage } from './scores';
import { createTag } from './tag';

let gameID;
const storageRef = storage.ref();

export function loadPicture() {
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

export function addListenerForScores() {
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
        addListenerForClicks();  
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

function addListenerForClicks() {
  db.collection("secureGameData").doc(gameID)
        .onSnapshot((doc) => {
          const data = doc.data();
          if (!data) return
          const target = data.target;
          if (!target) return
          if (data.hit) { 
            createTag(pictureIndex, target);
            handleGameOver(data);
          }
            else console.log(`${target} was missed`);
        });
}
  
export function addClickToCurrentGame(click) {
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
  
export function addNameToCurrentGame(name) {
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

export function getNumberOfCharacters() {
  return db.collection("secureGameData").doc("pictureInfo").get()
    .then((doc) => {
      const numberOfCharacters = doc.data().numbersOfCharacters[pictureIndex];
      return numberOfCharacters;
    });
}

export function getPosition(pictureIndex, target) {
  return db.collection("secureGameData").doc("pictureInfo").get()
    .then((doc) => {
      const positions = doc.data().positions;
      const position = positions[pictureIndex][target];
      return position;
    });
}