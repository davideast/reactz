import webpack from 'webpack';

export function createCompiler({ 
  usingTypeScript, 
  servingDir,
  absoluteEntryPath,
  memFS,
}) {
  const config = getConfig({ 
    usingTypeScript, 
    servingDir,
    absoluteEntryPath,
  })

  const compiler = webpack(config);

  if(memFS) {
    compiler.outputFileSystem = memFS;
  }

  return compiler;
}

export function getConfig({ usingTypeScript, servingDir, absoluteEntryPath }) {
  return usingTypeScript ?
    webpackConfigTypeScript({ dir: servingDir, absoluteEntryPath }) :
    webpackConfig({ dir: servingDir, absoluteEntryPath });
}

export async function webpackCompile(compiler: webpack.Compiler): Promise<webpack.Stats> {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stats);
    });
  });
}

export function webpackConfig({ dir, absoluteEntryPath }) {
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.js', '.jsx' ]
    },
    target: 'web',
    entry: absoluteEntryPath,
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
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        }
      ]
    }
  } as any;
}

export function webpackConfigTypeScript({ dir, absoluteEntryPath }) {
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: absoluteEntryPath,
    output: {
      filename: 'bundle.js',
      path: '/built'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        { 
          test: /\.tsx?$/, 
          loader: 'ts-loader',
        }
      ]
    }
  };
}
