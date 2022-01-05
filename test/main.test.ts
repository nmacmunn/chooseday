const runScript = () => jest.requireActual("../src/main");

describe("main", () => {
  beforeEach(() => jest.resetModules());
  it("should get #app from the document", () => {
    document.body.innerHTML = `<div id="app" />`;
    const spy = jest.spyOn(document, "getElementById");
    runScript();
    expect(spy).toHaveBeenCalledWith("app");
  });
  it("should throw an error if #app is not found", () => {
    document.body.innerHTML = `<div />`;
    expect(runScript).toThrow("Cannot mount application: #app not found");
  });
  it("should instantiate an App component with target #app", () => {
    document.body.innerHTML = `<div id="app" />`;
    const spy = jest.spyOn(document, "getElementById");
    const AppMock = jest.requireMock("../src/components/app").default;
    runScript();
    expect(AppMock).toHaveBeenCalledWith({ target: spy.mock.results[0].value });
  });
  it("should export the app instance", () => {
    document.body.innerHTML = `<div id="app" />`;
    const AppMock = jest.requireMock("../src/components/app").default;
    const defaultExport = runScript().default;
    expect(defaultExport).toBe(AppMock.mock.instances[0]);
  });
});

export {};
