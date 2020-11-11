const path = require('path')
const packagePath = path.join(path.resolve('./'), 'package.json')
const { dependencies } = require(packagePath)

module.exports = ({ config, env, empEnv }) => {
  console.log('empEnv===> 部署环境变量 serve模式不需要该变量', empEnv, env)
  const port = 8002
  const projectName = 'empReactProject'
  const publicPath = `http://localhost:${port}/`
  // 设置项目URL
  config.output.publicPath(publicPath)
  // 设置项目端口
  config.devServer.port(port)
  const remoteEntry = 'http://localhost:8001/emp.js'
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        // 项目名称
        name: projectName,
        // 暴露项目的全局变量名
        library: { type: 'var', name: projectName },
        // 被远程引入的文件名
        filename: 'emp.js',
        remotes: {
          // 远程项目别名:远程引入的项目名
          '@emp/react-base': 'empReactBase',
        },
        // 需要暴露的东西
        exposes: {
          // 别名:组件的路径
          './components/Hello': 'src/components/Hello',
          './helper': 'src/helper',
        },
        // 需要共享的依赖
        shared: {
          ...dependencies,
        },
      },
    }
    return args
  })
  // 配置 index.html
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        // head 的 title
        title: 'EMP - Project',
        // 远程调用项目的文件链接
        files: {
          js: [remoteEntry],
        },
      },
    }
    return args
  })
}
