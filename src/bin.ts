#!/usr/bin/env node

import { join } from "path";
import program from "commander";
import { publish } from './index';

program
  .description("Publish Android App Bundle to Google Play")
  .requiredOption("-k, --keyFile <path>", "set google api json key file")
  .requiredOption("-p, --packageName <name>", "set package name (com.some.app)")
  .requiredOption("-a, --aabFile <path>", "set path to .aab file")
  .requiredOption(
    "-t, --track <track>",
    "set track (production, beta, alpha...)"
  )
  .option("-e, --exit", "exit on error with error code 1.")
  .parse(process.argv);

publish({
  keyFile: join(process.cwd(), program.keyFile),
  packageName: program.packageName,
  aabFile: join(process.cwd(), program.aabFile),
  track: program.track
})
.then(() => {
  console.log('Publish complete.');
})
.catch((error: Error) => {
  console.error(error.message);
  process.exit(program.exit ? 1 : 0);
})