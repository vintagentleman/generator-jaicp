"use strict";
const path = require("path");

const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("projectName", {
      desc: "The name of the new project",
      default: "jaicp-project",
    });
  }

  paths() {
    if (this.options.projectName) {
      this.destinationRoot(
        this.destinationRoot() + path.sep + this.options.projectName
      );
    }
  }

  initializing() {
    this.log(yosay(`Welcome to the ${chalk.red("JAICP")} project generator!`));
  }

  prompting() {
    const prompts = [];

    if (!this.options.projectName) {
      prompts.push({
        name: "projectName",
        message: "What will be the name of the new project?",
        default: "jaicp-project",
      });
    }

    prompts.push({
      name: "nluLanguage",
      message: "What language should the bot support?",
      type: "list",
      choices: ["en", "ru"],
      default: "en",
    });

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("chatbot.yaml"),
      this.destinationPath("chatbot.yaml"),
      {
        projectName: this.options.projectName || this.props.projectName,
        nluLanguage: this.props.nluLanguage,
      }
    );
    this.fs.copy(
      this.templatePath(`${this.props.nluLanguage}/src/main.sc`),
      this.destinationPath("src/main.sc")
    );
    this.fs.copy(
      this.templatePath(`${this.props.nluLanguage}/test/test.xml`),
      this.destinationPath("test/test.xml")
    );
  }
};
