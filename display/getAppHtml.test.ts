import getAppHtml from "./getAppHtml";

describe("DisplayApp()", () => {
  it("Returns some html", () => {
    expect(typeof getAppHtml()).toBe("string");
  });
});
