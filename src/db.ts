import type {
  CollectionReference,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  increment,
  onSnapshot,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "./firebase";
import type { Criterion, Decision, Rating, Option, User } from "./types/data";

const db = getFirestore(app);

const criterionCollection = collection(db, "criteria") as CollectionReference<
  Omit<Criterion, "id">
>;
const decisionCollection = collection(db, "decisions") as CollectionReference<
  Omit<Decision, "id">
>;
const optionCollection = collection(db, "options") as CollectionReference<
  Omit<Option, "id">
>;
const ratingsCollection = collection(db, "ratings") as CollectionReference<
  Omit<Rating, "id">
>;

/**
 * Create a new criterion, increment the weight of existing criteria, and
 * create a rating.
 */
export async function addCriterion(
  decisionId: string,
  title: string,
  user: User
) {
  const options = await getDocs(queryOptions(decisionId));
  const criteria = await getDocs(queryCriteria(decisionId, user));
  runTransaction(db, async (transaction) => {
    criteria.forEach(({ ref }) => {
      transaction.update(ref, { weight: increment(1) });
    });
    const newCriterion = doc(criterionCollection);
    transaction.set(newCriterion, {
      decisionId,
      title,
      user,
      weight: 1,
    });
    options.forEach(({ id }) => {
      const rating = doc(ratingsCollection);
      transaction.set(rating, {
        criterionId: newCriterion.id,
        decisionId,
        optionId: id,
        user,
        weight: 1,
      });
    });
  });
}

/**
 * Create a new decision.
 */
export async function addDecision(
  creator: User,
  title: string
): Promise<string> {
  const doc = await addDoc(decisionCollection, {
    collaborators: [],
    created: Date.now(),
    creator,
    title,
  });
  return doc.id;
}

/**
 * Create a new option and add create a rating joining it with each existing
 * criterion.
 *
 * @todo prevent this when results already exist
 */
export async function addOption(decisionId: string, title: string) {
  const criteria = await getDocs(queryCriteria(decisionId));
  runTransaction(db, async (transaction) => {
    const ref = doc(optionCollection);
    transaction.set(ref, {
      created: Date.now(),
      decisionId,
      title,
    });
    criteria.forEach((criterionDoc) => {
      const rating = doc(ratingsCollection);
      transaction.set(rating, {
        criterionId: criterionDoc.id,
        decisionId,
        optionId: ref.id,
        user: criterionDoc.get("user"),
        weight: 1,
      });
    });
  });
}

/**
 * Get a query for criteria with the specified decisionId and userId
 */
function queryCriteria(decisionId: string, user?: User) {
  const q = query(criterionCollection, where("decisionId", "==", decisionId));
  if (!user) {
    return q;
  }
  return query(q, where("user.id", "==", user.id));
}

/**
 * Get a query for criteria with the specified decisionId
 */
function queryOptions(decisionId: string) {
  return query(optionCollection, where("decisionId", "==", decisionId));
}

/**
 * Get a query for criteria with the specified decisionId and userId
 */
function queryRatings(decisionId: string, userId?: string) {
  const q = query(ratingsCollection, where("decisionId", "==", decisionId));
  if (!userId) {
    return q;
  }
  return query(q, where("userId", "==", userId));
}

/**
 * Delete the specified criterion, associated ratings, and adjust weights of
 * remaining criteria.
 */
export async function removeCriterion({
  id,
  decisionId,
  user,
  weight,
}: Criterion) {
  const criterionDocs = await getDocs(queryCriteria(decisionId, user));
  const ratingDocs = await getDocs(
    query(ratingsCollection, where("criterionId", "==", id))
  );
  runTransaction(db, async (transaction) => {
    criterionDocs.forEach((item) => {
      if (item.get("weight") > weight) {
        transaction.update(item.ref, { weight: increment(-1) });
      }
    });
    ratingDocs.forEach(({ ref }) => transaction.delete(ref));
    transaction.delete(doc(criterionCollection, id));
  });
}

/**
 * Delete everything associated with the specified decisionId.
 */
export async function removeDecision(decisionId: string) {
  const optionDocs = await getDocs(queryOptions(decisionId));
  const criterionDocs = await getDocs(queryCriteria(decisionId));
  const ratingDocs = await getDocs(queryRatings(decisionId));
  runTransaction(db, async (transaction) => {
    const ref = doc(decisionCollection, decisionId);
    transaction.delete(ref);
    optionDocs.forEach(({ ref }) => transaction.delete(ref));
    criterionDocs.forEach(({ ref }) => transaction.delete(ref));
    ratingDocs.forEach(({ ref }) => transaction.delete(ref));
  });
}

/**
 * Delete the specified option and associated ratings and results.
 */
export async function removeOption(optionId: string) {
  const ratingDocs = await getDocs(
    query(ratingsCollection, where("optionId", "==", optionId))
  );
  runTransaction(db, async (transaction) => {
    const ref = doc(optionCollection, optionId);
    transaction.delete(ref);
    ratingDocs.forEach(({ ref }) => transaction.delete(ref));
  });
}

/**
 * Perform a batch update of ratings weights.
 */
export async function setRatingsWeights(weights: [string, number][]) {
  runTransaction(db, async (transaction) => {
    for (const [ratingId, weight] of weights) {
      const ref = doc(ratingsCollection, ratingId);
      transaction.update(ref, { weight });
    }
  });
}

/**
 * Subscribe to criteria with the specified decisionId and userId.
 */
export function subscribeCriteria(
  decisionId: string,
  callback: (created: Criterion[]) => void
) {
  const query = queryCriteria(decisionId);
  return onSnapshot(query, (criteria) => {
    const results = criteria.docs.map(mergeId);
    callback(results);
  });
}

/**
 * Subscribe to decisions with the specified userId. Callback is invoked
 * with decisions separated into those that the user created and those
 * that the user is a collaborator on.
 */
export function subscribeDecisions(
  user: User,
  callback: (decisions: {
    creator: Decision[];
    collaborator: Decision[];
  }) => void
) {
  let creator: Decision[] = [];
  let collaborator: Decision[] = [];

  const creatorQuery = query(
    decisionCollection,
    where("creator.id", "==", user.id)
  );
  const unsubCreator = onSnapshot(creatorQuery, (decisions) => {
    creator = decisions.docs.map(mergeId);
    callback({ creator, collaborator });
  });
  if (!user.email) {
    return unsubCreator;
  }
  const collaboratorQuery = query(
    decisionCollection,
    where("collaborators", "array-contains", user.email)
  );
  const unsubCollaborator = onSnapshot(collaboratorQuery, (decisions) => {
    collaborator = decisions.docs.map(mergeId);
    callback({ creator, collaborator });
  });
  return () => {
    unsubCreator();
    unsubCollaborator();
  };
}

/**
 * Subscribe to ratings with the specified decisionId and userId.
 */
export function subscribeRatings(
  decisionId: string,
  callback: (ratings: Rating[]) => void
) {
  const query = queryRatings(decisionId);
  return onSnapshot(query, (ratings) => {
    const results = ratings.docs.map(mergeId);
    callback(results);
  });
}

/**
 * Subscribe to options with the specified decisionId.
 */
export function subscribeOptions(
  decisionId: string,
  callback: (options: Option[]) => void
) {
  const query = queryOptions(decisionId);
  return onSnapshot(query, (options) => {
    const results = options.docs.map(mergeId);
    callback(results);
  });
}

/**
 * Update the title and weight of a criterion.
 */
export function updateCriterion({ id, title, weight }: Criterion) {
  const ref = doc(criterionCollection, id);
  updateDoc(ref, { title, weight });
}

/**
 * Update the collaborators and title of a decision.
 */
export function updateDecision({ collaborators, id, title }: Decision) {
  const ref = doc(decisionCollection, id);
  updateDoc(ref, { collaborators, title });
}

/**
 * Update the title of an option.
 */
export function updateOption({ id, title }: Option) {
  const ref = doc(optionCollection, id);
  updateDoc(ref, { title });
}

/**
 * Update the weight of a rating.
 */
export function updateRating({ id, weight }: Rating) {
  const ref = doc(ratingsCollection, id);
  updateDoc(ref, { weight });
}

/**
 * Utility function for converting a database document into an object that
 * contains the document id.
 */
function mergeId<T>(doc: QueryDocumentSnapshot<T>): { id: string } & T {
  return {
    id: doc.id,
    ...doc.data(),
  };
}
