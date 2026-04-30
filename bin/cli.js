#!/usr/bin/env node

import { program } from "commander";
import create from "../src/commands/create.js";

program
  .command("create")
  .argument("[type]", "Type de projet (html, php, node, express, react, tailwind, python)")
  .argument("[name]", "Nom du projet")
  .option("-t, --template <url>", "External template URL (git or path)")
  .description("Create a new project from template")
  .action(create);

program.parse(process.argv);
