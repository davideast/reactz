#!/usr/bin/env node
// Note! These default exports are because of the esModuleInterop option, which memory-fs
// requires. This turns "* as module" imports to default imports, or something like that.
import program from 'commander';
import MemoryFS from 'memory-fs';
import { logStart, logNoServingDirError } from './log';
import { createCompiler } from './webpack-compiler';
import series from 'async/series';
import { checkTS, runStep, buildWebpack, stepServer } from './flags';
import { noServingDirProvided, getAbsoluteEntryPath } from './util';

export const memFS = new MemoryFS();

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

    logStart();

    const port = program.port || 8001;
    const usingTypeScript = !!program.typescript;
    const absoluteEntryPath = getAbsoluteEntryPath({ servingDir, program });

    const compiler = createCompiler({ 
      usingTypeScript, 
      servingDir,
      absoluteEntryPath,
      memFS,
    })

    const context = { 
      compiler,
      usingTypeScript, 
      servingDir, 
      port, 
      absoluteEntryPath 
    };
    
    series({
      ts: callback => {
        checkTS();
        callback();
      },
      webpack: function (callback){
        buildWebpack(context).then(() => {
          console.log('done webpack');
          callback();
        });
      }
    }, () => {
      console.log('server');
      stepServer(context);
    });

  })
  .parse(process.argv);

if (noServingDirProvided(global_ServingDir)) {
  logNoServingDirError();
  process.exit(0);
}



