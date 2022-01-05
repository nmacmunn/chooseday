import { doc, getDocs } from "@firebase/firestore";
import type { User } from "../types/data";
import {
  criterionCollection,
  decisionCollection,
  optionCollection,
  ratingCollection,
} from "./collection";
import { queryCriteria, queryOptions, queryRatings } from "./query";

export function criterionRef(id?: string) {
  if (id) {
    return doc(criterionCollection, id);
  }
  return doc(criterionCollection);
}

export function decisionRef(id?: string) {
  if (id) {
    return doc(decisionCollection, id);
  }
  return doc(decisionCollection);
}

export function optionRef(id?: string) {
  if (id) {
    return doc(optionCollection, id);
  }
  return doc(optionCollection);
}

export function ratingRef(id?: string) {
  if (id) {
    return doc(ratingCollection, id);
  }
  return doc(ratingCollection);
}

/**
 * Get criteria from firestore by decisionId and optional user
 */
export function getCriteria(decisionId: string, user?: User) {
  const query = queryCriteria(decisionId, user);
  return getDocs(query);
}

/**
 * Get options from firestore by decisionId
 */
export function getOptions(decisionId: string) {
  const query = queryOptions(decisionId);
  return getDocs(query);
}

/**
 * Get ratings from firestore by decisionId and optional user
 */
export function getRatings(decisionId: string, user?: User) {
  const query = queryRatings(decisionId, user);
  return getDocs(query);
}
