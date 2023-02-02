"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

const generatorPath = path.join(__dirname, "../generators/app");
const defaultPrompts = { template: "empty-project", nluLanguage: "en" };

describe("different ways to set project name", () => {
  it("uses the name passed as CLI argument", () => {
    helpers
      .run(generatorPath)
      .withArguments("foo")
      .withPrompts(defaultPrompts)
      .then(() => {
        assert.fileContent("chatbot.yaml", /^name: foo/);
      });
  });

  it("uses the name passed in response to prompt", () => {
    helpers
      .run(generatorPath)
      .withPrompts({ ...defaultPrompts, projectName: "bar" })
      .then(() => {
        assert.fileContent("chatbot.yaml", /^name: bar/);
      });
  });

  it("uses the fallback name", () => {
    helpers
      .run(generatorPath)
      .withPrompts(defaultPrompts)
      .then(() => {
        assert.fileContent("chatbot.yaml", /^name: jaicp-empty-project/);
      });
  });

  afterEach(async () => {
    await sleep(1000); // Wait for file operations to complete
  });
});

/* eslint no-promise-executor-return: ["off"] */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
