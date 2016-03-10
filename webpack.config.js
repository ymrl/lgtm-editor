module.exports = {
    entry: './src/main.js',
    output: {
      filename: './dist/main.js'
    },
    devtool: 'inline-source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'react']
          }
        },
      ],
      postLoaders: [
        { loader: "transform?brfs" }
      ]
    },
    resolve: {
      extensions: ['', '.js']
    }
};
