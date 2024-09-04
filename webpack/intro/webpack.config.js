// loader:1.下载2.使用(配置loader)
// plugins: 1.下载 2.引入 3.使用
const {resolve} = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        // 要使用多个loader处理用use
        use: ['style-loader', 'css-loader', 'less-loader']
        // 样式文件跟js是一起的，无需写outputPath
      },
      {
        // 问题：默认处理不了html中img图片
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        // 使用一个loader
        // 下载 url-loader file-loader
        // TODO 注意webpack5弃用了url-loader
        use: [
          {
            loader: 'url-loader',
            // TODO options在use的时候必须写成该模式，不能跟use同级
            options: {
              // 图片大小小于8kb，就会被base64处理
              // 优点: 减少请求数量（减轻服务器压力）
              // 缺点：图片体积会更大（文件请求速度更慢）
              limit: 300 * 1024,
              // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
              // 解析时会出问题：[object Module]
              // 解决：关闭url-loader的es6模块化，使用commonjs解析
              esModule: false,
              // 给图片进行重命名
              // [hash:10]取图片的hash的前10位
              // [ext]取文件原来扩展名
              name: '[hash:10].[ext]',
              outputPath: 'imgs'
            }
          }
        ],
        // 在rules中设置type: avascript/auto'来解决 asset 重复的问题
        type: 'javascript/auto'
        
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // {
      //   // 排除该。。。下的资源，打包其他资源
      // // TODO webpack5无需写该部分
      //   exclude: /.(css|html|less|jpg|png|gif|js|json)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[hash:10].[ext]'
      //   },
      //   type: 'javascript/auto'
      // }
    ]
  },
  plugins: [
    // 功能:默认会创建一个空的HTML，自动引入打包输出的所有资源 (JS/CSS) 
    new HTMLWebpackPlugin({
      // 复制该文件的内容
      template: './src/index.html'
    })
  ],
  mode: 'development',

  // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径
    // contentBase: resolve(__dirname, 'build'),
    // TODO webpack5不支持contentBase，写成以下形式，也可不写
    // static: {
    //   directory:  resolve(__dirname, 'build'),
    // },
    // 启动gzip压缩
    compress: true,
    port: 3000,
    // 自动打开浏览器
    open: true,
    // TODO webpack5无法自动刷新
    watchFiles: ['./src/index.html']
  },
  target: 'web'
}