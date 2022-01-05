export const GoogleAuthProvider = jest.fn(() => ({}));
export const getAuth = jest.fn(() => ({}));
export const getRedirectResult = jest.fn(async () => null);
export const linkWithRedirect = jest.fn(async () => undefined);
export const onAuthStateChanged = jest.fn(() => () => undefined);
export const signInAnonymously = jest.fn(async () => ({
  user: {
    uid: "userId",
  },
}));
export const signInWithRedirect = jest.fn(async () => ({
  user: {
    uid: "userId",
    email: "user@example.com",
  },
}));
export const signOut = jest.fn(async () => null);
