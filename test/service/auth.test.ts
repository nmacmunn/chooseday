const Firebase = () => jest.requireMock("../../src/service/firebase");
const Auth = () => jest.requireMock("@firebase/auth");

const runScript = () => jest.requireActual("../../src/service/auth");

describe("auth service", () => {
  beforeEach(() => jest.resetModules());
  describe("auth", () => {
    it("should invoke getAuth with app", () => {
      runScript();
      expect(Auth().getAuth.mock.calls[0]).toEqual([Firebase().app]);
    });
  });

  describe("authListener", () => {
    it("should invoke onAuthStateChanged with auth and a callback", () => {
      Auth().getAuth.mockReturnValue({});
      runScript().authListener(() => undefined);
      expect(Auth().onAuthStateChanged).toHaveBeenCalledWith(
        {},
        expect.any(Function)
      );
    });
    it("should invoke callback with undefined on sign out", () => {
      const callback = jest.fn();
      runScript().authListener(callback);
      const handler = Auth().onAuthStateChanged.mock.calls[0][1];
      handler(null);
      expect(callback).toHaveBeenCalledWith(undefined);
    });
    it("should invoke callback with id on anonymous signin", () => {
      const callback = jest.fn();
      runScript().authListener(callback);
      const handler = Auth().onAuthStateChanged.mock.calls[0][1];
      handler({ uid: "userId" });
      expect(callback).toHaveBeenCalledWith({
        id: "userId",
      });
    });
    it("should invoke callback with email and id on provider signin", () => {
      const callback = jest.fn();
      runScript().authListener(callback);
      const handler = Auth().onAuthStateChanged.mock.calls[0][1];
      handler({ uid: "userId", email: "user@example.com" });
      expect(callback).toHaveBeenCalledWith({
        id: "userId",
        email: "user@example.com",
      });
    });
  });
  describe("getRedirectResult", () => {
    it("should invoke getRedirectResult with auth", () => {
      Auth().getAuth.mockReturnValue({});
      runScript().getRedirectResult();
      expect(Auth().getRedirectResult).toHaveBeenCalledWith({}, undefined);
    });
    it("should return the result of getRedirectResult", () => {
      const result = runScript().getRedirectResult();
      expect(Auth().getRedirectResult).toHaveReturnedWith(result);
    });
  });
  describe("linkWithGoogle", () => {
    it("should not link if currentUser is null", () => {
      runScript().linkWithGoogle();
      expect(Auth().linkWithRedirect).not.toHaveBeenCalled();
    });
    it("should invoke linkWithRedirect with currentUser and google auth provider", () => {
      Auth().getAuth.mockReturnValue({
        currentUser: {},
      });
      runScript().linkWithGoogle();
      expect(Auth().linkWithRedirect).toHaveBeenCalledWith(
        {},
        Auth().GoogleAuthProvider.mock.instances[0]
      );
    });
  });
  describe("signInAnonymously", () => {
    it("should invoke signInAnonymously with auth", () => {
      Auth().getAuth.mockReturnValue({});
      runScript().signInAnonymously();
      expect(Auth().signInAnonymously).toHaveBeenCalledWith({});
    });
    it("should return the result of signInAnonymously", () => {
      const result = runScript().signInAnonymously();
      expect(Auth().signInAnonymously).toHaveReturnedWith(result);
    });
  });
  describe("signInWithGoogle", () => {
    it("should invoke signInWithRedirectMock with auth and GoogleAuthProvider", () => {
      Auth().getAuth.mockReturnValue({});
      runScript().signInWithGoogle();
      expect(Auth().signInWithRedirect).toHaveBeenCalledWith(
        {},
        Auth().GoogleAuthProvider.mock.instances[0],
        undefined
      );
    });
    it("should return the result of signInWithRedirect", () => {
      const result = runScript().signInWithGoogle();
      expect(Auth().signInWithRedirect).toHaveReturnedWith(result);
    });
  });
  describe("signOut", () => {
    it("should invoke signOut with auth", () => {
      Auth().getAuth.mockReturnValue({});
      runScript().signOut();
      expect(Auth().signOut).toHaveBeenCalledWith({});
    });
    it("should return the result of signOut", () => {
      const result = runScript().signOut();
      expect(Auth().signOut).toHaveReturnedWith(result);
    });
  });
});

export {};
