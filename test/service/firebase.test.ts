const Env = () => jest.requireMock("../../src/util/env");
const App = () => jest.requireMock("@firebase/app");

const runScript = () => jest.requireActual("../../src/service/firebase");

describe("firebase service", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe("app", () => {
    it("should initializeApp with environment variables", () => {
      Env().getEnv.mockReturnValue({
        VITE_FIREBASE_API_KEY: "apiKey",
        VITE_FIREBASE_APP_ID: "appId",
        VITE_FIREBASE_AUTH_DOMAIN: "authDomain",
        VITE_FIREBASE_MESSAGE_SENDER_ID: "messagingSenderId",
        VITE_FIREBASE_PROJECT_ID: "projectId",
        VITE_FIREBASE_STORAGE_BUCKET: "storageBucket",
      });
      runScript();
      expect(App().initializeApp.mock.calls[0]).toEqual([
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
      const result = {};
      App().initializeApp.mockReturnValue(result);
      expect(runScript().app).toBe(result);
    });
  });
});

export {};
