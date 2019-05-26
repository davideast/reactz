#!/usr/bin/env node
import program from 'commander';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import { startServer } from './server';
import { webpackConfig, webpackCompile, webpackConfigTypeScript } from './webpack-compiler';
import { gradientLog, log, errorLog } from './log';

export const memFS = new MemoryFS();

gradientLog('⚡️ Starting react-serve!\n')

program
  .version('0.0.2')
  .arguments('<dir>')
  .option('-p, --port [number]', 'Specify port')
  .option('-e, --entry [entry]', 'Entry point for webpack')
  .option('-t, --typescript', 'Compile for TypeScript')
  .action(async dir => {
    if(dir == undefined) {
      const message = `No serving directory specified! Try something like serve-react public`;
      log(message);
      throw new Error(message);
    }
    
    const port = program.port || 8001;
    const ts = !!program.typescript;
    const entry = getEntry(program);
    
    // TODO(davideast): Handle custom configs or a default config OR! a TypeScript config
    
    if(ts) {
      log('> Using a TypeScript webpack config');
    }

    log('> Looking for a webpack entry point...');

    const config = ts ? 
      webpackConfigTypeScript({ dir, file: entry }) : 
      webpackConfig({ dir, file: entry });

    log(`> > Found ${process.cwd()}/${dir}/${entry} !\n`);
    log(`> > Staring webpack!\n`);
    
    const compiler = webpack(config);
    compiler.outputFileSystem = memFS;
    const stats = await webpackCompile(compiler);
    
    // TODO(davideast): Find all built bundles so you can indicate what is 
    // served from in memory and what is static

    log(`${stats.toString()}\n`);

    if(stats.compilation.errors.length > 0) {
      return;
    }

    log(`> > Build successful! \n`);
    log(`> Starting server! \n`);

    gradientLog(`------------------------------------------------------------------\n`);
    log(`The webpack bundle (/bundle.js) is served from an in memory filesystem. \n`);
    log(`Static files are served from ${process.cwd()}/${dir}\n`);
    gradientLog('------------------------------------------------------------------\n');

    startServer({ publicDir: dir, port });
  })
  .parse(process.argv);

errorLog('No serving directory specified! Try something like: serve-react public\n')

function getEntry(program) {
  let entry;
  if (!program.entry) {
    if (program.typescript) {
      entry = 'index.tsx';
    }
    else {
      entry = 'index.js';
    }
  }
  else {
    entry = program.entry;
  }
  return entry;
}

