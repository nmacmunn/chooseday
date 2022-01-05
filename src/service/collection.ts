import type { CollectionReference } from "@firebase/firestore";
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
