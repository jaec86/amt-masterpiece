module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-import'),
          require('tailwindcss'),
          require('autoprefixer'),
        ]
      }
    }
  },
  chainWebpack: config => {
    config
      .module
        .rule('glslify')
        .test(/\.(glsl|vs|fs|vert|frag)$/)
        .use('raw-loader')
          .loader('raw-loader')
          .end()
        .use('glslify-loader')
          .loader('glslify-loader')
          .end()
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/amt-masterpiece/' : '/'
}
