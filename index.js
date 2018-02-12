#!/usr/bin/env node

/**
 * Module dependencies.
 */
const inquirer = require("inquirer");
const valk = require("commander");
const semver = require("semver");
const fs = require("fs-extra");

/**
 * Setup the vala scripts.
 */
const valaScaffold = require("./vala");

valk.version("0.0.1");
valk.command("new").action(async () => {
  let newProjQ = [
    {
      type: "input",
      name: "name",
      message: "Name ?",
      validate: name => {
        if (!name) {
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: "input",
      name: "author",
      message: "Author ?",
      validate: author => {
        if (!author) {
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: "input",
      name: "email",
      message: "Email ?",
      validate: Email => {
        if (!Email) {
          return false;
        } else {
          return true;
        }
      }
    },
    {
      type: "input",
      name: "rdnn",
      message: "RDNN ?",
      validate: rdnn => {
        if (!rdnn) {
          return false;
        } else {
          const splits = rdnn.split(".");
          return splits.length < 3 ? false : true;
        }
      }
    },
    {
      type: "input",
      name: "version",
      message: "Version ?",
      validate: version => {
        if (!version) {
          return false;
        } else {
          return !!semver.valid(version);
        }
      }
    },
    {
      type: "list",
      name: "license",
      message: "License ?",
      choices: ["GPL-3.0"]
    },
    {
      type: "list",
      name: "type",
      message: "Type ?",
      choices: ["vala"]
    },
    {
      type: "list",
      name: "icon",
      message: "Icon Type ?",
      choices: ["circle", "rectangle-H", "rectangle-V", "square"]
    }
  ];

  // save settings to disk
  let answers = await inquirer.prompt(newProjQ);
  await fs.outputJSON(`${__dirname}/${answers.name}/app.json`, answers);

  await scaffold(answers.name);
});

/**
 * Reads app.json from __dirname or
 * @param {string} dir
 * and @returns {object} json
 */
async function readApp(dir = __dirname) {
  let appJsonDir = `${dir}/app.json`;
  return await fs.readJSON(appJsonDir);
}

/**
 * Scaffolds out a project with
 * @param {string} name
 * as directory name.
 */
async function scaffold(name) {
  const appDir = `${__dirname}/${name}`;
  let appJSON = await readApp(appDir);

  switch (appJSON.type) {
    case "vala":
      await valaScaffold(appDir, appJSON);
      break;

    default:
      await valaScaffold(appDir, appJSON);
      break;
  }
}

valk.parse(process.argv);
