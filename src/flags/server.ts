import { log, gradientLog } from '../log';
import { startServer } from '../server';

export function stepServer(context) {
  log(`> Starting server! \n`);
  gradientLog(`------------------------------------------------------------------\n`);

  log(`The webpack bundle (/bundle.js) is served from an in memory file system.\n`);
  log(`Static files are served from ${process.cwd()}/${context.servingDir}\n`);

  gradientLog('------------------------------------------------------------------\n');

  startServer(context);
  return;
}
