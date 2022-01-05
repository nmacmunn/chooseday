import type { QueryDocumentSnapshot } from "@firebase/firestore";

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
