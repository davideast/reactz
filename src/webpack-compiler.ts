import webpack from 'webpack';
import path from 'path';

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

export function webpackConfig({ dir, file }) {
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.js', '.jsx' ]
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

export function webpackConfigTypeScript({ filePath }) {
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: path.resolve(process.cwd(), `${filePath}`),
    output: {
      filename: 'bundle.js',
      path: '/built'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' }
      ]
    }
  };
}
