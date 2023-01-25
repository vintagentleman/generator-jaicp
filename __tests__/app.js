"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-jaicp:app", () => {
  beforeAll(() =>
    helpers.run(path.join(__dirname, "../generators/app")).withPrompts({
      template: "empty-project",
      nluLanguage: "en",
      projectName: "empty-project",
    })
  );

  it("creates files", () => {
    assert.file(["chatbot.yaml"]);
  });
});
