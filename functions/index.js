const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
const { firestore } = require("firebase-admin");
const { firebaseConfig } = require("firebase-functions");
admin.initializeApp();

const db = admin.firestore();
// Listen for the creation of any `games` document.
exports.initGame = functions.firestore
  .document("games/{gameID}")
  .onCreate((change, context) => {
    const pictureIndex = change.data().pictureIndex;

    const gameID = context.params.gameID;
    return db.collection("secureGameData").doc("pictureInfo").get()
    .then((doc) => {
      const position = doc.data().positions[pictureIndex];
      const numberOfCharacters = doc.data().numbersOfCharacters[pictureIndex];
      return db.collection("secureGameData").doc(gameID)
      .set({
        hit: false,
        startTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        position: position,
        targetsHit: [],
        numberOfCharacters: numberOfCharacters,
      })
    });
  });


// Listen for updates to any `games` document.
exports.evaluateHit = functions.firestore
  .document("games/{gameID}")
  .onUpdate((change, context) => {
    // Retrieve the current and previous value
    const data = change.after.data();
    const previousData = change.before.data();

    const clicks = data.clicks;
    const length = data.clicks.length;
    const previousLength = previousData.clicks.length;
    // Only does something if a click has been added to the current game
    if (length === previousLength) return null;

    const click = clicks[length - 1];
    const target = click.target;
    const gameID = context.params.gameID;

    //return a promise
    return db.collection("secureGameData").doc(gameID).get()
      .then((doc) => {
        const position = doc.data().position;

        const isTargetHit =
          position[target]["xmin"] <= click.x &&
          position[target]["xmax"] >= click.x &&
          position[target]["ymin"] <= click.y &&
          position[target]["ymax"] >= click.y;

        const targetsHit = doc.data().targetsHit;
        if (isTargetHit && targetsHit.indexOf(target)===-1) targetsHit.push(target);
        
        const isGameOver = isTargetHit && doc.data().numberOfCharacters===targetsHit.length;
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        
          return db.collection("secureGameData").doc(gameID)
                  .update({
                    hit: isTargetHit,
                    target: target,
                    click: click,
                    timestamp: timestamp,
                    targetsHit: targetsHit,
                    isGameOver: isGameOver,
                  })
      })
      .catch((error) => {
        console.log("error: ", error);
        return null;
      })
  });

//we calculate the time from the timestamps
exports.calcTime = functions.firestore
  .document("secureGameData/{gameID}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    let time = data.time;
    const isGameOver = data.isGameOver;
    //we only calculate if we have not done yet and the game is over
    if (time || !isGameOver) return null;
    const gameID = context.params.gameID;
    const startTimestamp = data.startTimestamp;
    const timestamp = data.timestamp;
    if (!timestamp) return null;
    time = (timestamp.toMillis() - startTimestamp.toMillis()) / 1000;
    return db.collection("secureGameData").doc(gameID)
      .update({
        time: time,
      })
      .catch((error) => {
        console.log("error: ", error);
        return null;
      })
  });

//we update the scores with the score of the current game
exports.updateScore = functions.firestore
  .document("games/{gameID}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    const username = data.username;
    const prevUsername = previousData.username;
    //if username has not been updated we do not do anything
    if (username === prevUsername) return null;
    const pictureIndex = data.pictureIndex;
    const gameID = context.params.gameID;
    const secureGameData = db.collection("secureGameData").doc(gameID);
    return secureGameData.get()
      .then((doc) => {
        const time = doc.data().time;
        const score = { username, time };
        const scoreData = db.collection("secureGameData").doc("scores");
        return scoreData.get()
        .then((doc) => {
          const scores = doc.data()[pictureIndex];
          let pos = 0;
          scores.forEach((score, index) => {
            if (score.time < time) pos = index + 1;
          });
          scores.splice(pos, 0, score);
          return scoreData.update({
            [pictureIndex]: scores,
          });
        });
      })
      .catch(error => {
        console.log('error: ', error);
      })
  })
