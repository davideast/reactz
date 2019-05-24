#!/usr/bin/env node

import express from 'express';
import program from 'commander';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import fs from 'fs';
import path from 'path';

/**
  reactz public/ -p 8000 --template index.html --rootSelector '#root'
 */

const memFS = new MemoryFS();
let publicDir;
program
  .version('0.0.0')
  .arguments('<dir>')
  .option('-p, --port [number]', 'Specify port')
  .option('-t, --template [file]', 'Provide html template')
  .option('-w, --webpack [file]', 'Provide a webpack config')
  .action(async dir => {
    publicDir = dir;
    const config = webpackConfig({ dir, file: 'index.js' });
    const compiler = webpack(config);
    compiler.outputFileSystem = memFS;
    await compile(compiler);
    if(program.template) {
      const localTemplate = path.join(process.cwd(), program.template);
      memFS.writeFileSync(`/built/index.html`, fs.readFileSync(localTemplate, 'utf8'));
    }
  })
  .parse(process.argv);


const app = express()

app.get('**', (req, res) => {
  // This is really really hacky.
  let pieces = req.path.split('.');
  let extension = pieces.length > 1 ? pieces[pieces.length - 1] : 'html';
  let path = req.path === '/' ? '/index' : pieces.slice(0, pieces.length - 1);
  console.log(req.path, `/built${path}.${extension}`);

  res.send(memFS.readFileSync(`/built${path}.${extension}`, 'utf8'));
});

app.listen(parseInt(program.port, 10), () => console.log(`Listening on ${program.port}...`))


async function compile(compiler: webpack.Compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) { reject(err); return; }
      resolve(stats);
    });
  });
}

function webpackConfig({ dir, file }) {
  return {
    mode: 'development',
    resolve: {
      extensions: ['.js', '.tsx', '.ts']
    },
    target: 'web',
    entry: path.resolve(process.cwd(), `${dir}/${file}`),
    output: {
      filename: 'bundle.js',
      path: '/built'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        }
      ]
    }
  } as any;
}
