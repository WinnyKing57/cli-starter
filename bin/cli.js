#!/usr/bin/env node

const { program } = require("commander");
const create = require("../src/commands/create");

program
  .command("create <type> <name>")
  .description("Create a new project from template")
  .action(create);

program.parse(process.argv);
