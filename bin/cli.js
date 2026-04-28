#!/usr/bin/env node

const { program } = require("commander");
const create = require("../src/commands/create");

program
  .command("create")
  .argument("[type]", "Type de projet (html, php, node, express, react, tailwind, python)")
  .argument("[name]", "Nom du projet")
  .description("Create a new project from template")
  .action(create);

program.parse(process.argv);
