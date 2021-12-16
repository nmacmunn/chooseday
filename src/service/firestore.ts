import type {
  CollectionReference,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { collection, getFirestore } from "@firebase/firestore";
import type { Criterion, Decision, Option, Rating } from "../types/data";
import { app } from "./firebase";

export const firestore = getFirestore(app);

export const criterionCollection = collection(
  firestore,
  "criteria"
) as CollectionReference<Omit<Criterion, "id">>;

export const decisionCollection = collection(
  firestore,
  "decisions"
) as CollectionReference<Omit<Decision, "id">>;

export const optionCollection = collection(
  firestore,
  "options"
) as CollectionReference<Omit<Option, "id">>;

export const ratingCollection = collection(
  firestore,
  "ratings"
) as CollectionReference<Omit<Rating, "id">>;

/**
 * Utility function for converting a database document into an object that
 * contains the document id.
 */
export function mergeId<T>(doc: QueryDocumentSnapshot<T>): { id: string } & T {
  return {
    id: doc.id,
    ...doc.data(),
  };
}
