#!/usr/bin/env node

import { join } from "path";
import program from "commander";
import { publish } from './index';

program
  .description("Publish Android App Bundle to Google Play")
  .requiredOption("-k, --keyFile <path>", "Set google api json key file")
  .requiredOption("-p, --packageName <name>", "Set package name (com.some.app)")
  .requiredOption("-a, --aabFile <path>", "Set path to .aab file")
  .requiredOption(
    "-t, --track <track>",
    "Set track (production, beta, alpha...)"
  )
  .option("-e, --exit", "Exit on error with error code 1.")
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