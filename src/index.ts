#!/usr/bin/env node
import program from 'commander';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import { startServer } from './server';
import { webpackConfig, webpackCompile } from './webpack-compiler';
import { gradientLog, log } from './log';

export const memFS = new MemoryFS();

gradientLog('⚡️ Starting react-serve!\n')

program
  .version('0.0.2')
  .arguments('<dir>')
  .option('-p, --port [number]', 'Specify port')
  .option('-t, --template [file]', 'Provide html template')
  .option('-w, --webpack [file]', 'Provide a webpack config')
  .action(async dir => {
    log('> Looking for a webpack entry point...');
    const config = webpackConfig({ dir, file: 'index.js' });
    log(`> > Found ${process.cwd()}/${dir}/index.js !`);
    log(`> > Staring webpack!`);
    const compiler = webpack(config);
    compiler.outputFileSystem = memFS;
    await webpackCompile(compiler);
    log(`> > Build successful! \n`);
    log(`> Starting server! \n`);
    gradientLog(`------------------------------------------------------------------\n`);
    log(`The webpack bundle (/bundle.js) is served from an in memory filesystem. \n`);
    log(`Static files are served from ${process.cwd()}/${dir}\n`);
    gradientLog('------------------------------------------------------------------\n');
    startServer(dir);
  })
  .parse(process.argv);


