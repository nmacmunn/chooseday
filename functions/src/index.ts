import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const maxAge = 30 * 24 * 60 * 60 * 1000;

export const clean = functions.https.onCall(async (data) => {
  const inactiveUsers = await getInactiveUsers();
  const criterionCollection = admin.firestore().collection("criteria");
  const decisionCollection = admin.firestore().collection("decisions");
  const optionCollection = admin.firestore().collection("options");
  const ratingCollection = admin.firestore().collection("ratings");
  const result: Record<string, string[]> = {};

  for (const user of inactiveUsers) {
    result[user.uid] = [];

    const decisions = await decisionCollection
      .where("creator.id", "==", user.uid)
      .get();

    for (const decision of decisions.docs) {
      result[user.uid].push(decision.data().title);
      const options = await optionCollection
        .where("decisionId", "==", decision.id)
        .get();
      const criteria = await criterionCollection
        .where("decisionId", "==", decision.id)
        .get();
      const ratings = await ratingCollection
        .where("decisionId", "==", decision.id)
        .get();
      [...options.docs, ...criteria.docs, ...ratings.docs];
      if (data === true) {
        await admin.firestore().runTransaction(async (transaction) => {
          [
            decision,
            ...options.docs,
            ...criteria.docs,
            ...ratings.docs,
          ].forEach(({ ref }) => transaction.delete(ref));
        });
      }
    }
    if (data === true) {
      await admin.auth().deleteUser(user.uid);
    }
  }
  return result;
});

/**
 * Returns the list of all inactive users.
 */
async function getInactiveUsers(
  users: admin.auth.UserRecord[] = [],
  nextPageToken?: string
): Promise<admin.auth.UserRecord[]> {
  const result = await admin.auth().listUsers(1000, nextPageToken);
  const inactiveUsers = result.users.filter((user) => {
    const { lastRefreshTime, lastSignInTime } = user.metadata;
    const lastSeen = Date.parse(lastRefreshTime || lastSignInTime);
    return !user.emailVerified && lastSeen < Date.now() - maxAge;
  });
  users = [...users, ...inactiveUsers];
  if (result.pageToken) {
    return getInactiveUsers(users, result.pageToken);
  }
  return users;
}
