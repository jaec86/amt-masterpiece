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
  }
}
