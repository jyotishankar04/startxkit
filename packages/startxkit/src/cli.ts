#!/usr/bin/env node
import { Command } from "commander";
import { addModuleCommand } from "./commands/add-module.command";
import { doctorCommand } from "./commands/doctor.command";
import { infoCommand } from "./commands/info.command";

const program = new Command();

program.name("startxkit").description("StartXKit project CLI").version("0.1.3");

const add = program.command("add").description("Add generated resources");
add.command("module <name>").description("Add a backend module").action(addModuleCommand);

program.command("doctor").description("Check StartXKit project health").action(doctorCommand);
program.command("info").description("Print StartXKit project info").action(infoCommand);

await program.parseAsync(process.argv);
