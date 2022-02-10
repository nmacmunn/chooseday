import {
  doc,
  increment,
  onSnapshot,
  runTransaction,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import type { Criterion, Decision, Option, Rating, User } from "../types/data";
import { mergeId } from "../util/firestore";
import { decisionCollection, firestore } from "./collection";
import {
  criterionRef,
  decisionRef,
  getCriteria,
  getDecisions,
  getOptions,
  getRatings,
  optionRef,
  ratingRef,
} from "./docs";
import {
  queryCollaboratorDecisions,
  queryCreatorDecisions,
  queryCriteria,
  queryOptions,
  queryRatings,
} from "./query";

export function addCollaborator(
  { collaborators, id }: Decision,
  collaborator: User & { email: string }
) {
  if (
    !collaborators ||
    collaborators.find(({ id }) => id === collaborator.id)
  ) {
    return;
  }
  collaborators.push({ ...collaborator, active: true });
  const ref = decisionRef(id);
  updateDoc(ref, { collaborators });
}

/**
 * Create a new criterion, increment the weight of existing criteria, and
 * create a rating.
 */
export async function addCriterion(
  decisionId: string,
  title: string,
  user: User
) {
  const options = await getOptions(decisionId);
  const criteria = await getCriteria(decisionId, user);
  runTransaction(firestore, async (transaction) => {
    criteria.forEach(({ ref }) => {
      transaction.update(ref, { weight: increment(1) });
    });
    const newCriterion = criterionRef();
    transaction.set(newCriterion, {
      decisionId,
      title,
      user,
      weight: 1,
    });
    options.forEach(({ id }) => {
      const newRating = ratingRef();
      transaction.set(newRating, {
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
export function addDecision(creator: User, title: string): string {
  const ref = doc(decisionCollection);
  setDoc(ref, {
    collaborators: undefined,
    created: Date.now(),
    creator,
    title,
  });
  return ref.id;
}

/**
 * Create a new option and add create a rating joining it with each existing
 * criterion.
 *
 * @todo prevent this when results already exist
 */
export async function addOption(decisionId: string, title: string) {
  const criteria = await getCriteria(decisionId);
  runTransaction(firestore, async (transaction) => {
    const newOption = optionRef();
    transaction.set(newOption, {
      created: Date.now(),
      decisionId,
      title,
    });
    criteria.forEach((criterionDoc) => {
      const newRating = ratingRef();
      const user = criterionDoc.get("user");
      transaction.set(newRating, {
        criterionId: criterionDoc.id,
        decisionId,
        optionId: newOption.id,
        user,
        weight: 1,
      });
    });
  });
}

export function enableCollaborators({ collaborators, id }: Decision) {
  if (collaborators) {
    return;
  }
  const ref = decisionRef(id);
  updateDoc(ref, { collaborators: [] });
}

export function removeCollaborator(
  { collaborators, id }: Decision,
  collaborator: User
) {
  if (!collaborators) {
    return;
  }
  const record = collaborators.find(({ id }) => id === collaborator.id);
  if (!record) {
    return;
  }
  record.active = false;
  const ref = decisionRef(id);
  updateDoc(ref, { collaborators });
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
  const criteria = await getCriteria(decisionId, user);
  const ratings = await getRatings(decisionId, user);
  runTransaction(firestore, async (transaction) => {
    criteria.forEach((criterionDoc) => {
      if (criterionDoc.get("weight") > weight) {
        transaction.update(criterionDoc.ref, { weight: increment(-1) });
      }
    });
    ratings.forEach((ratingDoc) => {
      if (ratingDoc.get("criterionId") === id) {
        transaction.delete(ratingDoc.ref);
      }
    });
    const ref = criterionRef(id);
    transaction.delete(ref);
  });
}

/**
 * Delete everything associated with the specified decisionId.
 */
export async function removeDecision(decisionId: string) {
  const options = await getOptions(decisionId);
  const criteria = await getCriteria(decisionId);
  const ratings = await getRatings(decisionId);
  runTransaction(firestore, async (transaction) => {
    const ref = decisionRef(decisionId);
    transaction.delete(ref);
    criteria.forEach(({ ref }) => transaction.delete(ref));
    options.forEach(({ ref }) => transaction.delete(ref));
    ratings.forEach(({ ref }) => transaction.delete(ref));
  });
}

/**
 * Delete the specified option and associated ratings and results.
 */
export async function removeOption({ decisionId, id }: Option) {
  const ratings = await getRatings(decisionId);
  runTransaction(firestore, async (transaction) => {
    ratings.forEach((rating) => {
      if (rating.get("optionId") === id) {
        transaction.delete(rating.ref);
      }
    });
    const ref = optionRef(id);
    transaction.delete(ref);
  });
}

/**
 * Perform a batch update of ratings weights.
 */
export async function setRatingsWeights(weights: [string, number][]) {
  runTransaction(firestore, async (transaction) => {
    for (const [id, weight] of weights) {
      const ref = ratingRef(id);
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

export function subscribeCreatorDecisions(
  user: User,
  callback: (decisions: Decision[]) => void
) {
  const query = queryCreatorDecisions(user);
  return onSnapshot(query, (decisions) => {
    const results = decisions.docs.map(mergeId);
    callback(results);
  });
}

export function subscribeCollaboratorDecisions(
  user: User & { email: string },
  callback: (decisions: Decision[]) => void
) {
  const query = queryCollaboratorDecisions(user);
  return onSnapshot(query, (decisions) => {
    const results = decisions.docs.map(mergeId);
    callback(results);
  });
}

export function subscribeDecision(
  decisionId: string,
  callback: (decision: Decision | undefined) => void
) {
  const ref = decisionRef(decisionId);
  return onSnapshot(ref, (decision) => {
    const result = decision.exists() ? mergeId(decision) : undefined;
    callback(result);
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
 * After an anonymous user links to an account with email, update all of
 * their decisions.
 */
export async function updateCreator(creator: User & { email: string }) {
  const decisions = await getDecisions(creator);
  runTransaction(firestore, async (transaction) => {
    decisions.forEach(({ ref }) => transaction.update(ref, { creator }));
  });
}

/**
 * Update the title and weight of a criterion.
 */
export function updateCriterion({ id, title, weight }: Criterion) {
  const ref = criterionRef(id);
  updateDoc(ref, { title, weight });
}

/**
 * Update the collaborators and title of a decision.
 */
export function updateDecision({ collaborators, id, title }: Decision) {
  const ref = decisionRef(id);
  updateDoc(ref, { collaborators, title });
}

/**
 * Update the title of an option.
 */
export function updateOption({ id, title }: Option) {
  const ref = optionRef(id);
  updateDoc(ref, { title });
}

/**
 * Update the weight of a rating.
 */
export function updateRating({ id, weight }: Rating) {
  const ref = ratingRef(id);
  updateDoc(ref, { weight });
}
