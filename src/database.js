import { handleGameOver, createTag, pictureIndex } from './index';

let gameID;

export function addNewGameToDataBase() {
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