const { defineConfig } = require('@vue/cli-service')
const path = require("path")


module.exports = defineConfig({
  outputDir: path.resolve(__dirname, "dist"),
  transpileDependencies: true,
  lintOnSave: false,
  //代理跨域
  devServer: {
    proxy: {
      // "/api": {
      //   // target: "http://gmall-h5-api.atguigu.cn",

      // }
    },
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  },

})
