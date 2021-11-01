const path = require("path")
const vueSrc = "./src"
const vueComponents = "./src/components"
module.exports = {
  runtimeCompiler: true,
  css: {
    modules: false,
    requireModuleExtension: false,
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/assets/styles/app.scss";
        `
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, vueSrc),
        "@@": path.resolve(__dirname, vueComponents)
      },
      extensions: ['.js', '.vue', '.json']
    }
  }
}
