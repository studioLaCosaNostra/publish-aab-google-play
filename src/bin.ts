#!/usr/bin/env node

import { resolve } from "path";
import { Command } from "commander";
const program = new Command();
import { publish } from "./index";

program
  .description("Publish Android App Bundle to Google Play")
  .requiredOption("-k, --keyFile <path>", "set google api json key file")
  .requiredOption("-p, --packageName <name>", "set package name (com.some.app)")
  .requiredOption("-a, --aabFile <path>", "set path to .aab file")
  .requiredOption(
    "-t, --track <track>",
    "set track (production, beta, alpha...)"
  )
  .option("-c, --changesNotSentForReview", "Set changesNotSentForReview flag")
  .option("-s, --status", "Set the status at the store")
  .option("-e, --exit", "exit on error with error code 1.")
  .parse(process.argv);

const options = program.opts();

publish({
  keyFile: resolve(options.keyFile),
  packageName: options.packageName,
  aabFile: resolve(options.aabFile),
  track: options.track,
  changesNotSentForReview: options.changesNotSentForReview,
  status: options.status || 'completed'
})
  .then(() => {
    console.log("Publish complete.");
  })
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(options.exit ? 1 : 0);
  });
