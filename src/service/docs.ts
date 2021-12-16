import { doc, getDocs } from "@firebase/firestore";
import type { User } from "../types/data";
import {
  criterionCollection,
  decisionCollection,
  optionCollection,
  ratingCollection,
} from "./firestore";
import { queryCriteria, queryOptions, queryRatings } from "./query";

export function criterionRef(id?: string) {
  return doc(criterionCollection, id);
}

export function decisionRef(id?: string) {
  return doc(decisionCollection, id);
}

export function optionRef(id?: string) {
  return doc(optionCollection, id);
}

export function ratingRef(id?: string) {
  return doc(ratingCollection, id);
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
