const App = () => jest.requireMock("../src/components/app");
const Chart = () => jest.requireMock("chart.js/auto").default;
const Icons = () => jest.requireMock("uikit/dist/js/uikit-icons");
const UIKit = () => jest.requireMock("uikit").default;

jest.unmock("svelte/internal");
jest.unmock("xstate");

const runScript = () => jest.requireActual("../src/main");

describe("main", () => {
  beforeEach(() => jest.resetModules());
  it("should load the uikit icons plugin", () => {
    document.body.innerHTML = `<div id="app" />`;
    runScript();
    expect(UIKit().use).toHaveBeenCalledWith(Icons());
  });
  it("should get the document font family", () => {
    document.body.innerHTML = `<div id="app" />`;
    const spy = jest.spyOn(window, "getComputedStyle");
    runScript();
    expect(spy).toHaveBeenCalledWith(document.documentElement);
  });
  it("should set the default chart font", () => {
    document.body.innerHTML = `<div id="app" />`;
    const spy = jest.spyOn(window, "getComputedStyle");
    spy.mockReturnValue({ fontFamily: "font" } as CSSStyleDeclaration);
    runScript();
    expect(Chart().defaults.font.family).toBe("font");
  });
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
    runScript();
    expect(App().default).toHaveBeenCalledWith({
      target: spy.mock.results[0].value,
    });
  });
  it("should export the app instance", () => {
    document.body.innerHTML = `<div id="app" />`;
    const defaultExport = runScript().default;
    expect(defaultExport).toBe(App().default.mock.instances[0]);
  });
});

export {};
