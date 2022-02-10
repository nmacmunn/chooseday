const runScript = () => jest.requireActual("../../src/util/history");

describe("history util", () => {
  describe("historyListener", () => {
    it("should register a popstate listener", () => {
      const spied = jest.spyOn(window, "addEventListener");
      const callback = () => undefined;
      runScript().historyListener(callback);
      expect(spied).toBeCalledWith("popstate", expect.any(Function));
    });
    it("should invoke 'callback' with the pathname when popstate fires", (done) => {
      const spied = jest.spyOn(window, "addEventListener");
      const callback = (pathName) => {
        expect(pathName).toBe("/");
        done();
      };
      runScript().historyListener(callback);
      const listener = spied.mock.calls[0][1];
      (listener as () => void)();
    });
    it("should return a function the unregisters the callback", () => {
      const spied = jest.spyOn(window, "removeEventListener");
      const callback = () => undefined;
      const unregister = runScript().historyListener(callback);
      unregister();
      expect(spied).toHaveBeenCalledWith("popstate", expect.any(Function));
    });
  });
  describe("pushHistory", () => {
    it("should pushState if pathName doesn't match the current", () => {
      jest
        .spyOn(window, "location", "get")
        .mockReturnValue({ pathname: "/" } as Location);
      const spied = jest.spyOn(history, "pushState");
      runScript().pushHistory("/decisions");
      expect(spied).toHaveBeenCalledWith(undefined, "", "/decisions");
    });
    it("should not pushState if pathName matches the current", () => {
      jest
        .spyOn(window, "location", "get")
        .mockReturnValue({ pathname: "/decisions" } as Location);
      const spied = jest.spyOn(history, "pushState");
      runScript().pushHistory("/decisions");
      expect(spied).not.toHaveBeenCalled();
    });
  });
});

export {};
