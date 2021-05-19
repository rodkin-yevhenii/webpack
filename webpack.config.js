const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

// Paths
const assetsPath = ''
const paths = {
  assets: path.resolve(__dirname, assetsPath),
  src: {
    root: path.resolve(__dirname, assetsPath + 'src'),
    js: path.resolve(__dirname, assetsPath + 'src/js'),
    css: path.resolve(__dirname, assetsPath + 'src/css'),
    img: path.resolve(__dirname, assetsPath + 'src/img')
  },
  dist: {
    root: path.resolve(__dirname, assetsPath + 'assets'),
    js: path.resolve(__dirname, assetsPath + 'assets/js'),
    css: path.resolve(__dirname, assetsPath + 'assets/css'),
    img: path.resolve(__dirname, assetsPath + 'assets/img')
  }
}

// HTML files
const htmlFiles = [
  'index',
  '404',
  '500',
  'contacts',
  'geodesy',
  'geology',
  'land-management'
]

// Config
module.exports = (env, argv) => {
  // Functions
  const isDev = argv.mode === 'development'
  const plugins = () => {
    const plugins = [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: paths.src.root + '/favicon.png', to: paths.dist.root },
          { from: paths.src.img, to: paths.dist.img }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]

    htmlFiles.forEach(name => {
      plugins.push(
        new HtmlWebpackPlugin({
          filename: name + '.html',
          template: name + '.html'
        })
      )
    })

    return plugins
  }

  const babelOptions = preset => {
    const opts = {
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    }

    if (preset) {
      opts.presets.push(preset)
    }

    return opts
  }

  const jsLoaders = () => {
    const loaders = [{
      loader: 'babel-loader',
      options: babelOptions()
    }]

    if (isDev) {
      loaders.push('eslint-loader')
    }

    return loaders
  }

  return {
    mode: argv.mode,
    context: paths.src.root,
    entry: {
      main: './js/index.js',
      jquery: 'jquery'
      // forms: './js/forms.js'
    },
    output: {
      filename: 'js/[name].js',
      path: paths.dist.root,
      publicPath: '/'
    },
    resolve: {
      alias: {
        '@src': paths.src.root,
        '@js': paths.src.js,
        '@css': paths.src.css,
        '@img': paths.src.img
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: jsLoaders()
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: (resourcePath, context) => {
                  return path.relative(path.dirname(resourcePath), context) + '/'
                }
              }
            },
            'css-loader',
            'postcss-loader',
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|svg|gif)$/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      ]
    },
    plugins: plugins(),
    devServer: {
      port: 4200,
      hot: isDev
    },
    devtool: isDev ? 'source-map' : 'eval',
    externals: {
      jquery: 'jQuery'
    }
  }
}
