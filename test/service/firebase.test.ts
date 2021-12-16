jest.unmock("../../src/service/firebase");

const getEnvMock = () => jest.requireMock("../../src/util/env").getEnv;
// const getFirestoreMock = () =>
//   jest.requireMock("@firebase/firestore").getFirestore;
const initializeAppMock = () => jest.requireMock("@firebase/app").initializeApp;
const runScript = () => jest.requireActual("../../src/service/firebase");

describe("firebase service", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe("app", () => {
    it("should initializeApp with environment variables", () => {
      getEnvMock().mockReturnValue({
        VITE_FIREBASE_API_KEY: "apiKey",
        VITE_FIREBASE_APP_ID: "appId",
        VITE_FIREBASE_AUTH_DOMAIN: "authDomain",
        VITE_FIREBASE_MESSAGE_SENDER_ID: "messagingSenderId",
        VITE_FIREBASE_PROJECT_ID: "projectId",
        VITE_FIREBASE_STORAGE_BUCKET: "storageBucket",
      });
      runScript();
      expect(initializeAppMock().mock.calls[0]).toEqual([
        {
          apiKey: "apiKey",
          appId: "appId",
          authDomain: "authDomain",
          messagingSenderId: "messagingSenderId",
          projectId: "projectId",
          storageBucket: "storageBucket",
        },
      ]);
    });
    it("should be the value returned by initializeApp", () => {
      const app = {};
      initializeAppMock().mockReturnValue(app);
      expect(runScript().app).toEqual(app);
    });
  });

  // describe("firestore", () => {
  //   it("should getFirestore with app", () => {
  //     const app = {};
  //     initializeAppMock().mockReturnValue(app);
  //     getEnvMock().mockReturnValue({});
  //     runScript();
  //     expect(getFirestoreMock().mock.calls[0]).toEqual([app]);
  //   });
  //   it("should be the value returned by getFirestore", () => {
  //     const firestore = {};
  //     getFirestoreMock().mockReturnValue(firestore);
  //     getEnvMock().mockReturnValue({});
  //     const FirebaseService = runScript();
  //     expect(FirebaseService.firestore).toBe(firestore);
  //   });
  // });
});

export {};
