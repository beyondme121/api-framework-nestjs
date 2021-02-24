### helmet
> helmet是express的中间件，通过设置各种header来为express应用提供安全保护。虽然不能完全杜绝安全问题，但确实能提供某种程度的保护

### 项目构建顺序
1. 拦截器
自定义日志 `nest g in interceptors/logging --no-spec`

2. 使用管道和拦截器对返回的数据进行转换,封装成统一的数据返回格式
`npm i class-transformer`

3. 错误过滤器
封装统一错误返回的格式

4. 使用管道对前端传递的参数进行校验
`npm i class-validator`
`nest g pi pipes/validation/validation --no-spec`


### redis
- 下载 Redis 5.0.10 for Windows
- 解压zip, 配置环境变量, 修改redis密码和允许远程连接 修改redis.windows.conf
  - # bind 127.0.0.1  注释掉这行,表示允许远程连接
  - requirepass 123456   设置密码
- 启动cmd, 输入 redis-server 就可以启动redis的服务端了,如果设置了密码 命令行中输入 auth "密码"
- 重新打开新的cmd, 输入redis-cli, 读写操作测试连接
  - set name abc
  - get name
- Redis Desktop Manager的使用

### modules
```
nest g mo modules/redis-utils/redis-utils --no-spec
nest g s modules/redis-utils/redis-utils --no-spec
```
`npm i ioredis`


### 支持sequelize的原生sql操作


### 功能
- 注册
- 登录 jwt


### 管道
- 全局的验证管道 main.ts中使用 app.use(new ValidationPipe())
  - 在controller中的参数只要设置了参数的Dto,就会自动转换dto这个类,使用class-validator这个包进行校验对象的属性

- 全局的另外一种方式是依赖注入的方式, 去掉main.ts中use方法,在app.module.ts中使用
  ```ts
  {
    provide: APP_PIPE,
    useClass: ValidationPipe
  }
  ```

### 执行顺序
中间件 -> 守卫 -> (拦截器or管道)
守卫在每个中间件之后执行，但在任何拦截器或管道之前执行。
比如: 日志中间件肯定会先执行, 进行日志记录, 以权限守卫为例, 用户请求了一个未授权的路由, 就不会进行执行拦截器(比如异常拦截器) 也不会进入路由的处理函数调用管道去(验证或转换参数)


## 日志收集
- 一个良好的服务端，应该有较完善的日志收集功能，这样才能在生产环境发生异常时，能够从日志中复盘，找出 Bug 所在
- 要针对项目中抛出的异常进行归类，并将信息反映在接口或日志中
- 请求接口的参数也应该被记录，以便统计分析（主要用于大数据和恶意攻击分析）
- log4js  > https://juejin.cn/post/6844903442054381582#heading-0
### 使用中间件实现入参的日志记录 originalURL, method, query, post, params...

### 使用拦截器记录出参, 用于记录bug的定位

### 异常处理