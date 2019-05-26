#!/usr/bin/env node
import program from 'commander';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import path from 'path';
import { startServer } from './server';
import { webpackConfig, webpackCompile, webpackConfigTypeScript } from './webpack-compiler';
import { gradientLog, log, errorLog, successLog } from './log';

export const memFS = new MemoryFS();

gradientLog('⚡️ Starting react-serve!\n')

program
  .version('0.0.2')
  .arguments('<servingDir>')
  .option('-p, --port [number]', 'Specify port')
  .option('-e, --entry [entry]', 'Entry point for webpack')
  .option('-t, --typescript', 'Comspile for TypeScript')
  .action(async servingDir => {
    if(servingDir == undefined) {
      const message = `No serving directory specified! Try something like serve-react public`;
      log(message);
      throw new Error(message);
    }
    
    const port = program.port || 8001;
    const ts = !!program.typescript;
    const absoluteEntryPath = getAbsoluteEntryPath({ servingDir, program });
    
    if(ts) {
      log('> Using a TypeScript webpack config');
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

    if(webpackBuildHasErrors(stats)) { return; }

    successLog(`> > Build successful! \n`);
    log(`> Starting server! \n`);

    gradientLog(`------------------------------------------------------------------\n`);

    log(`The webpack bundle (/bundle.js) is served from an in memory filesystem. \n`);
    log(`Static files are served from ${process.cwd()}/${servingDir}\n`);
    
    gradientLog('------------------------------------------------------------------\n');

    startServer({ publicDir: servingDir, port });
  })
  .parse(process.argv);

function getAbsoluteEntryPath({ program, servingDir }: { program: any, servingDir: string }) {
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
