import path from 'path';
import fs from 'fs';
import { log, logTsconfigError } from '../log';

export function hasTsconfig() {
  return fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
}

export function checkTS() {
  log('> Using a TypeScript webpack config');
  // Check for a tsconfig.json file. If one doesn't exist it will result in an error
  // when compiling. Warn the user of this and give them an example config to copy
  // and paste.
  const tsconfigExists = hasTsconfig();
  if (!tsconfigExists) {
    logTsconfigError();
    process.exit(0);
    return;
  }
  return;
}
