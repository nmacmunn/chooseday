import * as fa from "firebase/auth";
import { app } from "./firebase";
import type { User } from "./types/data";

const auth = fa.getAuth(app);
const google = new fa.GoogleAuthProvider();

export function authListener(callback: (user: User | undefined) => void) {
  return fa.onAuthStateChanged(auth, (user) => {
    if (!user) {
      callback(undefined);
      return;
    }
    const { uid: id, email } = user;
    if (!email) {
      callback({ id });
    } else {
      callback({ email, id });
    }
  });
}

export const getRedirectResult = fa.getRedirectResult.bind(fa, auth);

export function linkWithGoogle() {
  const { currentUser } = auth;
  if (currentUser) {
    fa.linkWithRedirect(currentUser, google);
  }
}

export const signInAnonymously = fa.signInAnonymously.bind(fa, auth);

export const signInWithGoogle = fa.signInWithRedirect.bind(
  fa,
  auth,
  google,
  undefined
);

export const signOut = fa.signOut.bind(fa, auth);
