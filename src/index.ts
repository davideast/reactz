#!/usr/bin/env node
// Note! These default exports are because of the esModuleInterop option, which memory-fs
// requires. This turns "* as module" imports to default imports, or something like that.
import program from 'commander';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import path from 'path';
import fs from 'fs';
import { startServer } from './server';
import { gradientLog, log, errorLog, successLog } from './log';
import {
  webpackConfig, webpackCompile, webpackConfigTypeScript
}
  from './webpack-compiler';

export const memFS = new MemoryFS();

log('⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️\n');
gradientLog('⚡️             Starting react-serve!               ⚡️\n')
log('⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️ ⚡️\n');

let global_ServingDir;

program
  .version('0.0.3')
  .arguments('<servingDir>')
  .option('-p, --port [number]', 'Specify port')
  .option('-e, --entry [entry]', 'Entry point for webpack')
  .option('-t, --typescript', 'Compile for TypeScript')
  .action(async servingDir => {
    /**
     * This action callback is not triggered unless the user provides their 
     * serving directory. This means checking for it's existence here won't work
     * for informing them of their error. If no serving directory is provided it will
     * skip over this action and go straight to the check for the serving dir. The
     * global variable will be undefined and log the error message.
     * 
     * However, this action callback fires synchronously, so if they provide a serbing
     * directory we need to do a check to not erroneously log the message.
     */
    global_ServingDir = servingDir;

    const port = program.port || 8001;
    const ts = !!program.typescript;
    const absoluteEntryPath = getAbsoluteEntryPath({ servingDir, program });

    if (ts) {
      log('> Using a TypeScript webpack config');

      // Check for a tsconfig.json file. If one doesn't exist it will result in an error
      // when compiling. Warn the user of this and give them an example config to copy
      // and paste.
      const tsconfigExists = hasTsconfig();
      if(!tsconfigExists) {
        logTsconfigError();
      }
    }

    log('> Looking for a webpack entry point...');

    const config = ts ?
      webpackConfigTypeScript({ dir: servingDir, absoluteEntryPath }) :
      webpackConfig({ dir: servingDir, absoluteEntryPath });

    successLog(`> > Using ${absoluteEntryPath}\n`);
    log(`> > Staring webpack!\n`);

    const compiler = webpack(config);
    compiler.outputFileSystem = memFS;
    const stats = await webpackCompile(compiler);
    log(`${stats.toString()}\n`);

    if (webpackBuildHasErrors(stats)) {

      // Some errors are critical but are not formatted in red, which can be difficult
      // for a user to see. Below we find critical errors like EntryModuleNotFoundError and format them in red, then return.
      logCriticalErrors(stats);

      return;
    }

    successLog(`> > Build successful! \n`);
    log(`> Starting server! \n`);

    gradientLog(`------------------------------------------------------------------\n`);

    log(`The webpack bundle (/bundle.js) is served from an in memory file system.\n`);
    log(`Static files are served from ${process.cwd()}/${servingDir}\n`);

    gradientLog('------------------------------------------------------------------\n');

    startServer({ servingDir, port });
  })
  .parse(process.argv);

if (noServingDirProvided()) {
  logNoServingDirError();
  process.exit(0);
}

function logTsconfigError() {
  errorLog(`No tsconfig.json exists at the root of your current working directory (cwd). While serve-react tries to be as "zero-config" as possible, we require a tsconfig.json at the moment. 
  
  🔧 ---- HOW TO FIX ---- 🔧
  Create a tsconfig.json at the root of your cwd and copy and paste the example config below to get started. Note you may need to tweak this config to fit your requirements.\n`);
  log(`tsconfig.json
---------------------------------------------
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "react",
  }
}\n`);
}

function hasTsconfig() {
  return fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
}

function logNoServingDirError() {
  const message = `No serving directory specified!

serve-react needs know two things:

1) Serving directory. This is where your static assets are (index.html, styles.css, etc...).
   ex: serve-react static

2) Entry file for webpack. serve-react will look for an index.{js,tsx} file in the serving directory if no file is provided.
    ex: serve-react static -e src/index.js
`;
  errorLog(message);
}

function noServingDirProvided() {
  return global_ServingDir == undefined;
}

function logCriticalErrors(stats: webpack.Stats) {
  const { errors } = stats.compilation;
  // errors.map(e => console.log(Object.keys(e)));
  const noModuleFoundError = filterToFirst(errors, error => error.name === 'EntryModuleNotFoundError');
  if (noEntryModuleFound(noModuleFoundError)) {
    errorLog(`${noModuleFoundError.error}\n\n`);
    errorLog(`☝️ ☝️ ☝️ This means serve-react couldn't find your entry point for webpack to compile. You tell us where the entry point is with an -e flag. If you don't provide one, we try to look for an index.{js,tsx} in your serving directory. Try something like this:\n`);
    log('serve-react static -e src/index.js\n');
  }
}

function noEntryModuleFound(noModuleFoundError: any) {
  return noModuleFoundError != undefined;
}

function getAbsoluteEntryPath(
  { program, servingDir }: { program: any, servingDir: string }
) {
  return typeof program.entry === 'string' ?
    path.join(process.cwd(), program.entry) :
    path.join(process.cwd(), servingDir, `index.${determineExtension(program)}`);
}

function determineExtension(program: any) {
  return typeof program.typescript === 'boolean' ? 'tsx' : 'js';
}

function webpackBuildHasErrors(stats: webpack.Stats) {
  // For some reason stats.hasErrors() can return true when there are no errors?
  return stats.compilation.errors.length > 0
}

function filterToFirst(list: any[], filterCallback: (error: any) => boolean) {
  return list.filter(filterCallback)[0];
}
