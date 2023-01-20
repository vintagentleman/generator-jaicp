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
      required: false,
    });

    this.projectName = () =>
      this.options.projectName || // First priority: project name passed as CLI argument
      this.props.projectName || // Second priority: project name passed in response to prompt
      `jaicp-${this.props.template}`; // Fallback: prefixed template name
  }

  initializing() {
    this.log(yosay(`Welcome to the ${chalk.red("JAICP")} project generator!`));
  }

  prompting() {
    const prompts = [
      {
        name: "template",
        message: "Which sample project do you want to start with?",
        type: "list",
        choices: [
          {
            name: "Empty project",
            value: "empty-project",
          },
          {
            name: "Outbound call campaign",
            value: "call-campaign",
          },
        ],
      },
      {
        name: "nluLanguage",
        message: "What language should the bot support?",
        type: "list",
        choices: ["en", "ru"],
        default: "en",
      },
    ];

    if (!this.options.projectName) {
      prompts.push({
        name: "projectName",
        message: "What will be the name of the new project?",
      });
    }

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  paths() {
    this.sourceRoot([this.sourceRoot(), this.props.template].join(path.sep));
    this.destinationRoot(
      [this.destinationRoot(), this.projectName()].join(path.sep)
    );
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("chatbot.yaml"),
      this.destinationPath("chatbot.yaml"),
      {
        projectName: this.projectName(),
        nluLanguage: this.props.nluLanguage,
      }
    );
    this.fs.copy(
      this.templatePath(`${this.props.nluLanguage}/`),
      this.destinationPath()
    );
    this.log(`New project created as ${chalk.red(this.projectName())}.`);
  }
};
