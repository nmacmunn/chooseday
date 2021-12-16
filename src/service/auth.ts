import * as Auth from "@firebase/auth";
import type { User } from "../types/data";
import { app } from "./firebase";

const google = new Auth.GoogleAuthProvider();

const auth = Auth.getAuth(app);

export function authListener(callback: (user: User | undefined) => void) {
  return Auth.onAuthStateChanged(auth, (user) => {
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

export const getRedirectResult = Auth.getRedirectResult.bind(
  Auth,
  auth,
  undefined
);

export function linkWithGoogle() {
  const { currentUser } = auth;
  if (currentUser) {
    Auth.linkWithRedirect(currentUser, google);
  }
}

export const signInAnonymously = Auth.signInAnonymously.bind(Auth, auth);

export const signInWithGoogle = Auth.signInWithRedirect.bind(
  Auth,
  auth,
  google,
  undefined
);

export const signOut = Auth.signOut.bind(Auth, auth);
