const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
const { firestore } = require("firebase-admin");
const { firebaseConfig } = require("firebase-functions");
admin.initializeApp();

const db = admin.firestore();

// Listen for updates to any `user` document.
exports.evaluateHit = functions.firestore
  .document("games/{gameID}")
  .onUpdate((change, context) => {
    // Retrieve the current and previous value
    const data = change.after.data();
    const previousData = change.before.data();

    const clicks = data.clicks;
    const length = data.clicks.length;
    const click = clicks[length - 1];
    const target = click.target;
    const gameID = context.params.gameID;

    //return a promise
    return db.collection("secretGameData").doc(gameID).get()
      .then((doc) => {
        const position = doc.data().position;

        const isTargetHit =
          position[target]["xmin"] <= click.x &&
          position[target]["xmax"] >= click.x &&
          position[target]["ymin"] <= click.y &&
          position[target]["ymax"] >= click.y;

          return db.collection("secretGameData").doc(gameID)
                  .update({
                    hit: isTargetHit,
                    target: target,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                  })
      })
      .catch((error) => {
        console.log("error: ", error);
        return null;
      })
  });
