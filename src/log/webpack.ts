import webpack from 'webpack';
import { filterToFirst } from '../util';
import { errorLog, log } from './color-log';

export function logCriticalErrors(stats: webpack.Stats) {
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
