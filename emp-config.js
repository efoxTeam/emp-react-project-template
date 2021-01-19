const path = require('path')
const packagePath = path.join(path.resolve('./'), 'package.json')
const {dependencies} = require(packagePath)

module.exports = ({config, env, empEnv}) => {
  console.log('empEnv===> 部署环境变量 serve模式不需要该变量', empEnv, env)
  const port = 8002
  const projectName = 'empReactProject'
  const publicPath = `http://localhost:${port}/`
  // 设置项目URL
  config.output.publicPath(publicPath)
  // 设置项目端口
  config.devServer.port(port)
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
        name: "empReactProject",
        remotes: {
          "@emp/react-base": "empReactBase@http://localhost:8001/emp.js"
        },
        exposes: {
          "./components/Hello": "src/components/Hello",
          "./helper": "src/helper"
        },
        shared: {
        },
        // 被远程引入的文件名
        filename: 'emp.js',
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
        files: {},
      },
    }
    return args
  })
}
