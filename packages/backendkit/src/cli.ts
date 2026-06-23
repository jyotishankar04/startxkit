#!/usr/bin/env node
import { Command } from "commander";
import { addModuleCommand } from "./commands/add-module.command";
import { doctorCommand } from "./commands/doctor.command";
import { infoCommand } from "./commands/info.command";

const program = new Command();

program.name("backendkit").description("BackendKit project CLI").version("0.1.0");

const add = program.command("add").description("Add generated resources");
add.command("module <name>").description("Add a backend module").action(addModuleCommand);

program.command("doctor").description("Check BackendKit project health").action(doctorCommand);
program.command("info").description("Print BackendKit project info").action(infoCommand);

await program.parseAsync(process.argv);
