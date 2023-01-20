"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  initializing() {
    this.log(yosay(`Welcome to the ${chalk.red("JAICP")} project generator!`));
  }

  prompting() {
    const prompts = [
      {
        name: "projectName",
        message: "What will be the new project name?",
        default: "jaicp-project",
      },
      {
        name: "nluLanguage",
        message: "What language should the bot support?",
        type: "list",
        choices: ["en", "ru"],
        default: "en",
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("chatbot.yaml"),
      this.destinationPath("chatbot.yaml"),
      {
        projectName: this.props.projectName,
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
