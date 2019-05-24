import webpack from 'webpack';
import path from 'path';

export async function webpackCompile(compiler: webpack.Compiler) {
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
