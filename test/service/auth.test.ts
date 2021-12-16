import Mocks from "../mocks";

jest.unmock("../mocks");

const runScript = () => jest.requireActual("../../src/service/auth");

const mocks = Mocks(__dirname, {
  app: ["../../src/service/firebase"],
  getAuth: ["@firebase/auth"],
  onAuthStateChanged: ["@firebase/auth"],
  getRedirectResult: ["@firebase/auth"],
  linkWithRedirect: ["@firebase/auth"],
  GoogleAuthProvider: ["@firebase/auth"],
  signInAnonymously: ["@firebase/auth"],
  signInWithRedirect: ["@firebase/auth"],
  signOut: ["@firebase/auth"],
});

describe("auth service", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe("auth", () => {
    it("should invoke getAuth with app", () => {
      runScript();
      expect(mocks.getAuth.mock.calls[0]).toEqual([mocks.app]);
    });
  });

  describe("authListener", () => {
    it("should invoke onAuthStateChanged with auth and a callback", () => {
      const auth = {};
      mocks.getAuth.mockReturnValue(auth);
      runScript().authListener(() => undefined);
      expect(mocks.onAuthStateChanged.mock.calls[0][0]).toEqual(auth);
      expect(mocks.onAuthStateChanged.mock.calls[0][1]).toBeInstanceOf(
        Function
      );
    });
    it("should invoke callback with undefined on sign out", () => {
      const callback = jest.fn();
      runScript().authListener(callback);
      const handler = mocks.onAuthStateChanged.mock.calls[0][1];
      handler(null);
      expect(callback).toHaveBeenCalledWith(undefined);
    });
    it("should invoke callback with id on anonymous signin", () => {
      const callback = jest.fn();
      runScript().authListener(callback);
      const handler = mocks.onAuthStateChanged.mock.calls[0][1];
      handler({ uid: "userId" });
      expect(callback).toHaveBeenCalledWith({
        id: "userId",
      });
    });
    it("should invoke callback with email and id on provider signin", () => {
      const callback = jest.fn();
      runScript().authListener(callback);
      const handler = mocks.onAuthStateChanged.mock.calls[0][1];
      handler({ uid: "userId", email: "user@example.com" });
      expect(callback).toHaveBeenCalledWith({
        id: "userId",
        email: "user@example.com",
      });
    });
  });
  describe("getRedirectResult", () => {
    it("should invoke getRedirectResult with auth", () => {
      const auth = {};
      mocks.getAuth.mockReturnValue(auth);
      runScript().getRedirectResult();
      expect(mocks.getRedirectResult).toHaveBeenCalledWith(auth, undefined);
    });
    it("should return the result of getRedirectResult", () => {
      const result = runScript().getRedirectResult();
      expect(mocks.getRedirectResult).toHaveReturnedWith(result);
    });
  });
  describe("linkWithGoogle", () => {
    it("should not link if currentUser is null", () => {
      runScript().linkWithGoogle();
      expect(mocks.linkWithRedirect).not.toHaveBeenCalled();
    });
    it("should invoke linkWithRedirect with currentUser and google auth provider", () => {
      const auth = {
        currentUser: {},
      };
      mocks.getAuth.mockReturnValue(auth);
      runScript().linkWithGoogle();
      expect(mocks.linkWithRedirect).toHaveBeenCalledWith(
        auth.currentUser,
        mocks.GoogleAuthProvider.mock.instances[0]
      );
    });
  });
  describe("signInAnonymously", () => {
    it("should invoke signInAnonymously with auth", () => {
      const auth = {};
      mocks.getAuth.mockReturnValue(auth);
      runScript().signInAnonymously();
      expect(mocks.signInAnonymously).toHaveBeenCalledWith(auth);
    });
    it("should return the result of signInAnonymously", () => {
      const result = runScript().signInAnonymously();
      expect(mocks.signInAnonymously).toHaveReturnedWith(result);
    });
  });
  describe("signInWithGoogle", () => {
    it("should invoke signInWithRedirectMock with auth and GoogleAuthProvider", () => {
      const auth = {};
      mocks.getAuth.mockReturnValue(auth);
      runScript().signInWithGoogle();
      expect(mocks.signInWithRedirect).toHaveBeenCalledWith(
        auth,
        mocks.GoogleAuthProvider.mock.instances[0],
        undefined
      );
    });
    it("should return the result of signInWithRedirect", () => {
      const result = runScript().signInWithGoogle();
      expect(mocks.signInWithRedirect).toHaveReturnedWith(result);
    });
  });
  describe("signOut", () => {
    it("should invoke signOut with auth", () => {
      const auth = {};
      mocks.getAuth.mockReturnValue(auth);
      runScript().signOut();
      expect(mocks.signOut).toHaveBeenCalledWith(auth);
    });
    it("should return the result of signOut", () => {
      const result = runScript().signOut();
      expect(mocks.signOut).toHaveReturnedWith(result);
    });
  });
});

export {};
