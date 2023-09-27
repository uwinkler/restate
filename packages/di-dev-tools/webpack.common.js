const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const src = (file) => path.join(__dirname, 'src', file)

module.exports = {
  entry: {
    background: src('background.ts'),
    content: src('content.ts'),
    devtools: src('devtools.ts'),
    'injected-content': src('injected-content.ts'),
    panel: src('panel.tsx')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader' // Creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // Translates CSS into CommonJS
          },
          {
            loader: 'sass-loader' // Compiles Sass to CSS
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'assets', to: 'assets' }]
    }),
    new CopyPlugin({
      patterns: [
        {
          from: '*.html',
          context: 'src'
        },
        {
          from: 'manifest.json',
          context: 'src'
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
}
