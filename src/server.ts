import express from 'express';
import program from 'commander';
import { memFS } from './index';
import { log } from './log';

export function startServer(publicDir) {
  const app = createServer(publicDir);
  app.listen(parseInt(program.port, 10), () => console.log(`Listening on ${program.port}...`));
  return app;
}

const requestListener = function(publicDir) {
  return function(req, res, next) {
    log(`react-serve received a request for ${req.url}`);
    next();
  }
};

function createServer(publicDir: string) {
  const app = express();
  app.use(requestListener(publicDir));
  app.use(express.static(`./${publicDir}`));
  
  app.get('*', (req, res) => {
    let { path, extension } = parseFileExtension(req);
    res.send(memFS.readFileSync(`/built${path}.${extension}`, 'utf8'));
  });
  return app;
}

function parseFileExtension(req) {
  let pieces = req.path.split('.');
  let extension = pieces.length > 1 ? pieces[pieces.length - 1] : 'html';
  let path = req.path === '/' ? '/index' : pieces.slice(0, pieces.length - 1);
  return { path, extension };
}

