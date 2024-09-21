# webpack的重要性

- 首先，webpack是一个前端打包解决方案，可以融合各种前端新技术，将零散的js代码打包到一个js文件中
- 对于环境兼容，webpack可以先编译转换，然后再进行打包
- 对于不同类型的前端模块，webpack支持在JS中以模块化的方式载入任意类型的资源文件；例如在js中加载css文件，被加载的css文件将会通过style标签的方式工作
- 还具备代码拆分能力，能够将应用中的所有模块按需分块打包；不用担心单个文件过大，导致加载慢的问题
- 一些知名的脚手架工具，也大多基于webpack(比如create-react-app)

| 总结                          |
| --------------------------- |
| 实现打包之前自动清除上次打包的结果           |
| webpack在项目自动化构建方面的能力实现增强。   |
| 自动生成应用所需的html文件             |
| 根据不同环境为代码注入类似API地址这种可能变化的部分 |
| 拷贝不需要参与打包的资源文件到输出目录         |
| 压缩webpack打包完成后输出的文件         |
| 自动将打包结果发布到服务器实现自动部署         |

# 运行流程

- 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
- 开始编译：上⼀步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
- 确定入口：根据配置中的 entry 找出所有的入口⽂件；
- 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
- 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
- 输出资源：根据入口和模块之间的依赖关系，组装成⼀个个包含多个模块的 Chunk，再把每个 Chunk 转换成⼀个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

# 总结个人搭建项目过程

## vue-cli和webpack安装

## 搭建项目

vue init webpack <Project Name>

## 配置代理服务器

## 创建入口文件

## 创建系统入口页面

## 配置store

## 配置router

## 配置api

# 项目实践（过程）

## 配置基本的环境变量

- 分为index.js/dev.env.js/prod.env.js，放在config包下

  - ```js
    // prod.env.js
    'use strict'
    module.exports = {
      NODE_ENV: '"production"'
    }
    ```

  - ```js
    // dev.env.js
    'use strict'
    // 导入merge
    const merge = require('webpack-merge')
    // 导入默认配置
    const prodEnv = require('./prod.env')
    // 合并配置
    module.exports = merge(prodEnv, {
      NODE_ENV: '"development"'
    })
    ```

  - ```js
    // index.js
    const path = require('path');

    module.exports = {
      // 开发环境配置
      dev: {
        // 除了index.html之外的静态资源要存放的路径
        assetsSubDirectory: 'static',
        // 打包后，index.html里面引用资源的相对地址，根目录
        assetsPublicPath: '/',
        // 是 vue-cli 脚手架在开发模式下,提供一个跨域的代理中转服务器（代理服务器不是浏览器，没有同源策略的限制）
        proxyTable: {
          // 这里配置 '/rcs' 就等价于 target , 你在链接里访问 /rcs === http://localhost:19081
          '/rcs': {
            target: 'http://localhost:19081',
            // 是否是跨域请求，true则修改host头，但后端没有host校验就不需要
            // changeOrigin: true,
          }
        },
    	// 地址
        host: 'localhost',
        // 开发服务器监听的特定端口
        port: 8080, 
        // 是否在编译（npm run dev）后打开页面，默认为false
        autoOpenBrowser: false,
        // 浏览器错误提示
        errorOverlay: true,
        // 跨平台错误提示
        notifyOnErrors: true,
        // 使用文件系统(file system)轮询检查文件是否改变，是devServer.watchOptions的一个选项，效率很低
        poll: false,
        // source map形式，增加调试，压缩后也可直接定位到未压缩前的位置，选择cheap是因为代码每行不会很长，选择module是因为vue调试需要源码而不是转换后的，用eval能提高构建效率；不可在生产环境中使用，会暴露源码
        devtool: 'cheap-module-eval-source-map',
        // 在文件名后添加一个字符串用来查询，使缓存失效
        cacheBusting: true,
    	// 开启css的source map
        cssSourceMap: true
      },
      // 正式环境
      build: {
        // 编译注入的 index.html 文件,必须是本地的绝对路径
        index: path.resolve(__dirname, '../dist/index.html'),
    	// Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
    	// source map
        // 生成用于生产构建的源映射
        productionSourceMap: false,
        // 生成source-map文件
        devtool: '#source-map',
        // 是否开启 gzip
        productionGzip: false,
        // 需要使用 gzip 压缩的文件扩展名
        productionGzipExtensions: ['js', 'css'],
        // 分析项目的依赖关系，会在浏览器中生成一份bundler报告
        bundleAnalyzerReport: process.env.npm_config_report
      }
    };
    ```

## 生成loader的方法

- 在build/utils中，生成css loader和style loader的方法

  - ```js
    'use strict'
    const path = require('path')
    const config = require('../config')
    // 提取特定文件的插件，比如把css文件提取到一个文件中去
    const ExtractTextPlugin = require('extract-text-webpack-plugin')
    // 加载package.json文件
    const packageConfig = require('../package.json')

    // 生成编译输出的二级目录
    exports.assetsPath = function (_path) {
      const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    // path.posix是path模块跨平台的实现，不同操作系统路径不同
      return path.posix.join(assetsSubDirectory, _path)
    }

    // 为不同css预处理器提供统一的生成方法，也就是统一处理各css类型的打包问题
    exports.cssLoaders = function (options) {
      options = options || {}
    	// css模块
      const cssLoader = {
        loader: 'css-loader',
        options: {
          sourceMap: options.sourceMap
        }
      }
    // 
      const px2remLoader = {
        loader: 'px2rem-loader',
        options: {
          remUnit: 37.5
        }
      }
    // 相当于css解析器，本身没有插件，用来管理插件
      const postcssLoader = {
        loader: 'postcss-loader',
        options: {
          sourceMap: options.sourceMap
        }
      }

      // 创建loader加载器字符串，结合extract text插件
      function generateLoaders(loader, loaderOptions) {
        // 标明是否使用了postcss
        const loaders = options.usePostCSS ? [cssLoader, postcssLoader, px2remLoader] : [cssLoader, px2remLoader]
    	// 如果指定了具体loader的名称
        if (loader) {
          // 数组loaders加载器是从右向左执行的
          loaders.push({
            loader: loader + '-loader',
            options: Object.assign({}, loaderOptions, {
              sourceMap: options.sourceMap
            })
          })
        }

        // 明确需要提取静态文件
        if (options.extract) {
          // 包裹处理器
          return ExtractTextPlugin.extract({
            use: loaders,
            publicPath:'../../',
            // 如果loaders编译各种css文件不顺利，则继续用这个处理
            fallback: 'vue-style-loader'
          })
        } else {
          // 没有提取行为，则最后再用这个处理css
          return ['vue-style-loader'].concat(loaders)
        }
      }

    // 全局文件引入
      function resolveResouce(name) {
        return path.resolve(__dirname, '../src/assets/scss/' + name);
      }
      // 处理sass配置
      function generateSassResourceLoader() {
        var loaders = [
          cssLoader,
          px2remLoader,
          // 'postcss-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [resolveResouce('mixin.scss')]
            }
          }
        ];
        if (options.extract) {
          return ExtractTextPlugin.extract({
            use: loaders,
            fallback: 'vue-style-loader'
          })
        } else {
          return ['vue-style-loader'].concat(loaders)
        }
      }

      return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateSassResourceLoader(),
        scss: generateSassResourceLoader(),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
      }
    }

    // 为独立的style文件创建加载器配置
    exports.styleLoaders = function (options) {
      // 保存加载器配置的变量
      const output = []
      // 获取所有css文件类型的loaders
      const loaders = exports.cssLoaders(options)

      for (const extension in loaders) {
        const loader = loaders[extension]
        // 生成对应loader的配置
        output.push({
          test: new RegExp('\\.' + extension + '$'),
          use: loader
        })
      }

      return output
    }

    exports.createNotifierCallback = () => {
      // 跨平台的包，以类似浏览器同值的形式展现信息
      const notifier = require('node-notifier')

      return (severity, errors) => {
        // 只展示错误信息
        if (severity !== 'error') return

        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()

        notifier.notify({
          title: packageConfig.name,
          message: severity + ': ' + error.name,
          subtitle: filename || '',
          icon: path.join(__dirname, 'logo.png')
        })
      }
    }
    ```

- 在build/vue-loader.config.js中，是vue-loader的一些配置，将vue文件转换为js模块

  - ```js
    'use strict'
    const utils = require('./utils')
    const config = require('../config')
    const isProduction = process.env.NODE_ENV === 'production'
    const sourceMapEnabled = isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap

    module.exports = {
      loaders: utils.cssLoaders({
        sourceMap: sourceMapEnabled,
        extract: isProduction
      }),
      cssSourceMap: sourceMapEnabled,
      cacheBusting: config.dev.cacheBusting,
      // 再也不用require图片并生成变量了
      transformToRequire: {
        video: ['src', 'poster'],
        source: 'src',
        // 直接在src里写路径
        img: 'src',
        image: 'xlink:href'
      }
    }
    ```

## 配置拆分

- 在build包里面，新建webpack.base.config.js/webpack.prod.config.js/webpack.dev.conf.js分别表示基础/开发/生产环境下的配置文件

### webpack.base.conf.js

- 开发和生产共同使用提出来的基础配置文件，主要实现配制入口，配置输出环境，配置模块resolve和插件等

  - ```js
    'use strict'
    const path = require('path')
    const utils = require('./utils')
    const config = require('../config')
    const vueLoaderConfig = require('./vue-loader.conf')

    function resolve(dir) {
      // 拼出绝对路径
      return path.join(__dirname, '..', dir)
    }

    module.exports = {
      // 以/开始的路径片段为根目录，运行环境的上下文，实际的目录
      context: path.resolve(__dirname, '../'),
      // 配置入口，默认为单页面，所以只有app一个入口
      entry: {
        app: './src/main.js'
      },
      // 配置出口，默认是/dist作为目标文件夹的路径
      output: {
        path: config.build.assetsRoot,//路径
        filename: '[name].js',//文件名
        publicPath: process.env.NODE_ENV === 'production'
          ? config.build.assetsPublicPath
          : config.dev.assetsPublicPath // 公共存放路径
      },
      resolve: {
        // 自动的扩展后缀，比如js文件引用时可以不用写.js
        extensions: ['.js', '.vue', '.json'],
        // 创建路径别名
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          '@': resolve('src'),
        }
      },
      // 用插件配置相应文件的处理方法
      module: {
        rules: [
          // svg精灵图
          {
            test: /\.svg$/,
            loader: 'svg-sprite-loader',
            include: [resolve('src/icons/svg')],
            options: {
              symbolId: 'icon-[name]'
            }
          },
          {
            test: /\.scss$/,
            loaders: ['style', 'css', 'sass']
          },
          // vue-loader将vue文件转换
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
          },
          // js文件用babel-loader编译es5文件以及呀所
          {
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
              // 动态路由异步加载（import），路由懒加载
              plugins: ['syntax-dynamic-import']
            },
            include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
          },
          // 图片、音像、字体都使用url-loader进行处理，超过10000会编译成base64
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            exclude: [resolve('src/icons/svg')],
            options: {
              limit: 100000000,
              name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
          },
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 1000000,
              name: utils.assetsPath('media/[name].[hash:7].[ext]')
            }
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
          }
        ]
      },
      // 防止webpack注入一些nodejs到vue中，因为vue中已经具备了某些功能
      node: {
        setImmediate: false,
        // empty即空对象
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
      }
    }
    ```

### webpack.dev.config.js开发环境配置

- ```js
  'use strict'
  const utils = require('./utils')
  const webpack = require('webpack')
  const config = require('../config')
  const merge = require('webpack-merge')
  const path = require('path')
  const baseWebpackConfig = require('./webpack.base.conf')
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  // 可以在终端看到webpack运行时的错误和警告等信息
  const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
  // 查找一个未使用的端口
  const portfinder = require('portfinder')

  const HOST = process.env.HOST
  const PORT = process.env.PORT && Number(process.env.PORT)

  // 开发环境的完整的配置文件
  const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
      // 为独立的css类型文件添加loader配置
      rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    devtool: config.dev.devtool,

    // 对webpack-dev-server选项的基本配置
    devServer: {
      // 控制台日志级别，是对bundle生成之前的消息配置
      clientLogLevel: 'warning',
      // h5的history api任意404响应都要替代为index.html
      historyApiFallback: {
        rewrites: [
          { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
        ],
      },
      hot: true,
      // 静态文件路径
      contentBase: false,
      // 可以在js、css等文件的response header中发现又content-encoding:gzip响应头
      compress: true,
      host: HOST || config.dev.host,
      port: PORT || config.dev.port,
      open: config.dev.autoOpenBrowser,
      overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false,
      publicPath: config.dev.assetsPublicPath,
      proxy: config.dev.proxyTable,
      quiet: true,
      watchOptions: {
        poll: config.dev.poll,
      }
    },
    plugins: [
      // 在编译时可以配置的全局变量
      new webpack.DefinePlugin({
        'process.env': require('../config/dev.env')
      }),
      // 热替换模块
      new webpack.HotModuleReplacementPlugin(),
      // 热加载时直接返回更新文件名称，而不是文件id
      new webpack.NamedModulesPlugin(), 
      // 编译出错时跳过输出，确保输出无措
      new webpack.NoEmitOnErrorsPlugin(),
      // 生成html文件
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        // 将所有静态文件都插入到body文件末尾
        inject: true
      }),
      // 静态文件从源目录复制到构建目录
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../static'),
          to: config.dev.assetsSubDirectory,
          // 忽略编译器文件或特殊文件(.gitkeep)
          ignore: ['.*']
        }
      ])
    ]
  })

  module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    // 获取port返回一个promise
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err)
      } else {
        // 把获取的端口号设置为环境变量port的值
        process.env.PORT = port
        // 重新设置devServer的端口
        devWebpackConfig.devServer.port = port

        // FriendlyErrorsPlugin添加到配置文件中
        devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
          // 编译成功后输出的信息
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
          },
          // 编译出错，在桌面右上角显示错误通知框
          onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
        }))

        resolve(devWebpackConfig)
      }
    })
  })
  ```

### webpack.prod.config.js生产环境配置

- ```js
  'use strict'
  const path = require('path')
  const utils = require('./utils')
  const webpack = require('webpack')
  const config = require('../config')
  const merge = require('webpack-merge')
  const baseWebpackConfig = require('./webpack.base.conf')
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  // 将入口中所有chunk，移动到独立分离的css文件中，减少javascript包的大小，减少内联样式，可以跟js并行加载
  const ExtractTextPlugin = require('extract-text-webpack-plugin')
  // 压缩css模块
  const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
  // 压缩js文件
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

  const env = require('../config/prod.env')

  const webpackConfig = merge(baseWebpackConfig, {
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        // 生产环境extract选项，可以将chunk中的css代码抽离到独立文件
        extract: true,
        usePostCSS: true
      })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
      path: config.build.assetsRoot,
      // chunkhash是chunk内容的hash字符串，长度为20
      filename: utils.assetsPath('js/[name].[chunkhash].js'),
      // id是模块标识符
      chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': env
      }),
      new UglifyJsPlugin({
        uglifyOptions: {
          // 压缩行为
          compress: {
            // 删除未使用的变量等，不显示警告信息
            warnings: false
          }
        },
        sourceMap: config.build.productionSourceMap,
        // 多线程并行运行和文件缓存
        parallel: true
      }),
      new ExtractTextPlugin({
        // contenthash，根据内容生成的hash
        filename: utils.assetsPath('css/[name].[contenthash].css'),
        // 异步加载模块提取css内容，默认只从初始chunk中提取（CommonsChunkPlugin且公共chunk中提取chunk时）
        allChunks: true,
      }),
      // 对不同组件中相同的css可以剔除一部分
      new OptimizeCSSPlugin({
        // safe是避免cssnano压缩重复计算
        cssProcessorOptions: config.build.productionSourceMap
          ? { safe: true, map: { inline: false } }
          : { safe: true }
      }),
      new HtmlWebpackPlugin({
        filename: config.build.index,
        template: 'index.html',
        // 把script和link放在body底部
        inject: true,
        // 配置压缩性为
        minify: {
          // 移除注释
          removeComments: true,
          // 去除空格和换行
          collapseWhitespace: true,
          // 尽可能一处属性中的引号和空属性
          removeAttributeQuotes: true
        },
        // 控制chunks的顺序，这里表示按照依赖关系进行排序
        chunksSortMode: 'dependency'
      }),
      // 根据模块相对路径生成四位数的hash作为模块id
      new webpack.HashedModuleIdsPlugin(),
      // 将有联系的模块放到一个闭包函数中，减少闭包
      new webpack.optimize.ModuleConcatenationPlugin(),
      // 提取多个chunk的公共模块，合并成一个文件最开始加载一次后缓存，webpack4/5用的是splitChunk实现
      new webpack.optimize.CommonsChunkPlugin({
        // common chunk的名称
        name: 'vendor',
        // 所有从node_modules中引入的文件提取到vendor中
        minChunks (module) {
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0
          )
        }
      }),
      // 为了将项目从第三方依赖代码中抽离，因为app.js改变，vendor.js的hash也会改变，那么下次上线还是要重新生成缓存
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        // 马上生成chunk，但里面没有模块
        minChunks: Infinity
      }),
      // 额外的异步公共chunk
      new webpack.optimize.CommonsChunkPlugin({
        name: 'app',
        // 用此名称异步生成公共chunk，与其他chunks并行加载
        async: 'vendor-async',
        // 所有公共chunk的子模块被选择
        children: true,
        minChunks: 3
      }),

      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../static'),
          to: config.build.assetsSubDirectory,
          ignore: ['.*']
        },
        {
          from: path.resolve(__dirname, '../cordova'),
          to: path.resolve(__dirname, '../dist/cordova')
        }
      ])
    ]
  })

  if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
      new CompressionWebpackPlugin({
        // 目标资源名称，path替换成原资源路径，query替换成原查询字符串
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        // 匹配的资源
        test: new RegExp(
          '\\.(' +
          config.build.productionGzipExtensions.join('|') +
          ')$'
        ),
        // 只处理比这个值大的资源
        threshold: 10240,
        // 只有压缩率比这个小的资源才会被处理  
        minRatio: 0.8
      })
    )
  }

  if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }

  module.exports = webpackConfig
  ```

## 检查版本

- 用build/check-versions.js检查npm和node版本

- ````js
  'use strict'
  // 在终端为不同字体显示不同的风格
  const chalk = require('chalk')
  // 解析npm包的version
  const semver = require('semver')
  // 引入package.json文件
  const packageConfig = require('../package.json')
  // node版本的unix shell命令
  const shell = require('shelljs')
  // 执行命令的函数
  function exec (cmd) {
    return require('child_process').execSync(cmd).toString().trim()
  }

  const versionRequirements = [
    {
      name: 'node',
      // node版本
      currentVersion: semver.clean(process.version),
      // package.json中定义的node版本范围
      versionRequirement: packageConfig.engines.node
    }
  ]
  // which npm
  if (shell.which('npm')) {
    // npm存在
    versionRequirements.push({
      name: 'npm',
      currentVersion: exec('npm --version'),
      versionRequirement: packageConfig.engines.npm
    })
  }

  module.exports = function () {
    const warnings = []

    for (let i = 0; i < versionRequirements.length; i++) {
      const mod = versionRequirements[i]
  	// 版本之间的比较
      if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
        // 如果现有npm或node版本比定义的版本低，则生成一段警告
        warnings.push(mod.name + ': ' +
          chalk.red(mod.currentVersion) + ' should be ' +
          chalk.green(mod.versionRequirement)
        )
      }
    }

    if (warnings.length) {
      console.log('')
      console.log(chalk.yellow('To use this template, you must update following to modules:'))
      console.log()

      for (let i = 0; i < warnings.length; i++) {
        const warning = warnings[i]
        console.log('  ' + warning)
      }

      console.log()
      process.exit(1)
    }
  }
  ````

## build项目

- build/build.js打包时用到

- ```js
  'use strict'
  // 先检查版本
  require('./check-versions')()

  process.env.NODE_ENV = 'production'
  // 终端的spinner
  const ora = require('ora')
  // rm -rf
  const rm = require('rimraf')
  const path = require('path')
  const chalk = require('chalk')
  const webpack = require('webpack')
  const config = require('../config')
  const webpackConfig = require('./webpack.prod.conf')

  const spinner = ora('building for production...')
  spinner.start()
  //删除打包目标目录下的文件
  rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    // 打包
    webpack(webpackConfig, (err, stats) => {
      spinner.stop()
      if (err) throw err
      // 输出打包状态
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false, // ts-loader需要设置为true
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
      }

      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  })

  ```

## package.json修改启动命令

- ```json
    "scripts": {
      "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
      "start": "npm run dev",
      "build": "node build/build.js"
    },
    ```
# 与vite对比

- Webpack 会遍历你的应用程序中的所有文件，并启动一个开发服务器，然后将整个代码渲染到开发环境中。
  - webpack 从一个 entry.js 文件开始，将其依赖的所有 js 或者其他 assets 通过 loader 打包成一个文件， 随后这个打包后的文件将被从 server 传递到客户端浏览器运行。
  - 因为这样的处理规则，当保存文件时，整个 JavaScript 包将由 Webpack 重新构建，这就是为什么更改可能需要长达 10 秒才能反映在浏览器中，更新速度会随着应用体积增长而直线下降。
- Vite 的工作方式不同，它不会遍历整个应用程序，Vite 只是转换当时正在使用的文件/模块。
  - Vite 的核心理念：非捆绑开发构建，浏览器请求它时，使用 ES 模块转换并提供一段应用程序代码。
  - 开始开发构建时，Vite 首先将 JavaScript 模块分为两类：**依赖**模块和**源码**模块。
  - 依赖项模块是第三方依赖的代码，从 node_modules 文件夹中导入的 JavaScript 模块。这些模块将使用 esbuild 进行处理和捆绑，**esbuild** 是一个用 Go 编写的 JavaScript 打包工具，执行速度比 Webpack 快 10-100 倍。
  - 源码模块是源代码，即业务代码，通常涉及特定库的扩展，如：.jsx、.vue、.scss 文件。
  - 它使用基于路由的代码拆分来了解代码的哪些部分实际需要加载，因此，它不必重新打包所有内容。
  - 它还使用现代浏览器中的原生 ES 模块支持来交付代码，这让浏览器可以在开发中承担打包工作。
  - 在生产方面，虽然现在所有主流浏览器都支持原生 ES 模块，但它实现了诸如 tree-shaking、延迟加载和通用块拆分等性能优化技术，仍然比非打包应用程序带来更好的整体性能。出于这个原因，Vite 附带了一个预先配置的 build 命令，该命令使用 **Rollup** 打包来打包和实现各种性能优化。
- 他们都支持热更新但方式不同，vite用es模块的动态导入和原生hmr api实现，而webpack则通过内置的hmr插件实现

# bundle和bundless区别

- bundle指的是将多个模块打包成一个或多个文件的过程，比如webpack
- bundless强调无需打包整个应用，按需加载部分，比如vite通过原生esm实现
  - 可以减少不必要的加载和构建时间

# commonjs（cjs）和es modules（esm）区别

```js
// commonjs.js
 
// 导入模块
const add = require('./math');
 
// 使用模块中的函数
console.log(add(5, 3)); // 输出：8

// math.js
 
// 定义函数
const add = (a, b) => {
  return a + b;
};
 
// 导出函数
module.exports = add;
```

```js
// esmodules.mjs
 
// 导入模块
import { add } from './math.mjs';
 
// 使用模块中的函数
console.log(add(5, 3)); // 输出：8

// math.mjs
 
// 定义函数
export const add = (a, b) => {
  return a + b;
};
```

# 大型项目上vite和webpack

- vite会勉励挑战，如依赖分析和构建优化不如webpack成熟
- 但vite快速启动还是有优势
- webpack有更丰富的插件生态和强大的配置能力，在处理大型项目时更加灵活

# tree-shaking实现原理

## 什么是tree-shaking

- 是一种基于 ES Module 规范的 Dead Code Elimination 技术
- 它会在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾其它模块使用，并将其删除，以此实现打包产物的优化

## 在 Webpack 中启动 Tree Shaking

- 在 Webpack 中，启动 Tree Shaking 功能必须同时满足三个条件：

  - 使用 ESM 规范编写模块代码
  - 配置 `optimization.usedExports` 为 `true`，启动标记功能
  - 启动代码优化功能，可以通过如下方式实现：
    - 配置 `mode = production`
    - 配置 `optimization.minimize = true`
    - 提供 `optimization.minimizer` 数组

- ```js
  // webpack.config.js
  module.exports = {
    entry: "./src/index",
    mode: "production",
    devtool: false,
    optimization: {
      usedExports: true,
    },
  };

  ```

## 理论基础

- 在 CommonJs、AMD、CMD 等旧版本的 JavaScript 模块化方案中，导入导出行为是高度动态，难以预测的

- ```js
  if(process.env.NODE_ENV === 'development'){
    require('./bar');
    exports.foo = 'foo';
  }
  ```

- 而 ESM 方案则从规范层面规避这一行为，它要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量

- 所以，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用

## 实现原理

- Webpack 中，Tree-shaking 的实现一是先**标记**出模块导出值中哪些没有被用过，二是使用 Terser 删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：
  - Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中
  - Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
  - 生成产物时，若变量没有被其它模块使用则删除对应的导出语句