import { query, where } from "@firebase/firestore";
import type { User } from "../types/data";
import {
  criterionCollection,
  decisionCollection,
  optionCollection,
  ratingCollection,
} from "./firestore";

export function queryCollaboratorDecisions(user: User) {
  return query(
    decisionCollection,
    where("collaborator", "array-contains", user.email)
  );
}

export function queryCreatorDecisions(user: User) {
  return query(decisionCollection, where("creator.id", "==", user.id));
}

/**
 * Get a query for criteria with the specified decisionId and userId
 */
export function queryCriteria(decisionId: string, user?: User) {
  const q = query(criterionCollection, where("decisionId", "==", decisionId));
  if (!user) {
    return q;
  }
  return query(q, where("user.id", "==", user.id));
}

/**
 * Get a query for criteria with the specified decisionId
 */
export function queryOptions(decisionId: string) {
  return query(optionCollection, where("decisionId", "==", decisionId));
}

/**
 * Get a query for criteria with the specified decisionId and userId
 */
export function queryRatings(decisionId: string, user?: User) {
  const q = query(ratingCollection, where("decisionId", "==", decisionId));
  if (!user) {
    return q;
  }
  return query(q, where("user.id", "==", user.id));
}
