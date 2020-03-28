module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Coronachat * SARS-Cochat-19'
        return args
      })
  }
}