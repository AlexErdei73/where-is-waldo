const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Listen for updates to any `user` document.
exports.evaluateHit = functions.firestore
  .document("games/{gameId}")
  .onUpdate((change, context) => {
    // Retrieve the current and previous value
    const data = change.after.data();
    const previousData = change.before.data();

    // We'll only update if the length has changed.
    // This is crucial to prevent infinite loops.
    if (data.length == previousData.length) {
      return null;
    }
    const newClicks = data.clicks;
    const length = data.length;
    const click = newClicks[length - 1];
    const target = click.target;
    const position = data.position;

    const isTargetHit =
      position[target]["xmin"] <= click.x &&
      position[target]["xmax"] >= click.x &&
      position[target]["ymin"] <= click.y &&
      position[target]["ymax"] >= click.y;

    click.hit = isTargetHit;
    newClicks[length - 1] = click;

    // Then return a promise of a set operation to update the hit
    return change.after.ref.update({
      clicks: newClicks,
      isHitChecked: true,
    });
  });
