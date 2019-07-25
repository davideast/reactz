import { successLog, log, logCriticalErrors } from '../log';
import { webpackCompile } from '../webpack-compiler';
import webpack from 'webpack';

export async function buildWebpack(context) {
  log('> Looking for a webpack entry point...');

  successLog(`> > Using ${context.absoluteEntryPath}\n`);
  log(`> > Staring webpack!\n`);

  const stats = await webpackCompile(context.compiler);
  log(`${stats.toString()}\n`);

  if (webpackBuildHasErrors(stats)) {
    // Some errors are critical but are not formatted in red, which can be difficult
    // for a user to see. Below we find critical errors like EntryModuleNotFoundError and format them in red, then return.
    logCriticalErrors(stats);
  } else {
    console.log('success!');
    successLog(`> > Build successful! \n`);
  }
  return;

}

function webpackBuildHasErrors(stats: webpack.Stats) {
  // For some reason stats.hasErrors() can return true when there are no errors?
  return stats.compilation.errors.length > 0
}

function noEntryModuleFound(noModuleFoundError: any) {
  return noModuleFoundError != undefined;
}