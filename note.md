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


### class-validator + pipe管道配合入参校验
> https://github.com/typestack/class-validator


### 拦截器实现RBAC0
- 区别 RBAC1/2/3
- 1. RBAC1: 子角色, 子角色继承父角色
- 2. RBAC2: 基于 RBAC0 模型，增加了对角色的一些限制：角色互斥、基数约束、先决条件角色
- 3. 称为统一模型，它包含了 RBAC 1 和 RBAC 2，利用传递性，也把 RBAC 0 包括在内，综合了 RBAC 0、RBAC 1 和 RBAC 2 的所有特点


### 支持两种操作数据库的方式
- sequelize: 编写原生sql -> 已经实现
- TypeORM: 配置

### 设置环境变量NODE_ENV
npm i cross-env -D
cross-env NODE_ENV=dev


### 身份认证
- passport-local: 一种通过使用用户名密码的身份验证机制
- 必须安装的包: passport, @nestjs/passport
- 根据不同的验证策略,安装不同的包. 比如passport-local和passport-jwt


#### AuthService
- 任务是检索用户并验证密码
  - AuthService.validateUser: 接收username,password, 对client传递过来的密码进行加密, 并和数据库中保存的加密密码进行验证
  - UserService.findOneUser, 查询用户信息, 在validateUser方法中验证密码
  - auth/local.strategy.ts
  - @nestjs/passport 模块为我们提供了一个内置的守卫，可以完成这一任务。这个保护调用 Passport 策略并启动上面描述的步骤(检索凭证、运行verify 函数、创建用户属性等)
    - 在user.controller中的login方法中,使用守卫,
    ```ts
      @UseGuards(AuthGuard('local'))
      async login () {}
    ```
    - @UseGuards(AuthGuard('local')) 这个守卫的作用
      - 1. 限制未经身份验证的用户可以访问的路由, 在受保护的路由上放置一个守卫
      - 2. **Passport 特性: Passport 根据从 validate() 方法返回的值自动创建一个 user 对象，并将其作为 req.user 分配给请求对象**


### 登录流程
1. 客户端发出url路径请求 POST /user/login
2. 进去本地守卫LocalAuthGuard
3. passport内部调用 local.strategy.ts中的validate方法验证
4. authService提供验证方法, validateUser被调用,
5. 使用userService的查找一个用户的方法,然后验证用户名密码, 如果验证通过, 将返回值传递会调用处. local.strategy中的validate方法, 会将这个返回值设置到req.user属性上
6. 验证通过, 进入controller中的login方法内部, 调用authService.certificate,将有用的非敏感信息作为payload,
   (此处使用的数据不是用户请求发过来的参数,而是通过查询用户信息获得的有用信息)生成token
7. this.authService.certificate(req.user.data) 只对有用信息签发token
8. 对需要认证的接口进行装饰器操作 @UseGuards(AuthGuard('jwt'))
9. 会调用jwt.strategy中的validate方法，内部自动验证。

```ts
@UseGuards(LocalAuthGuard) // 启用用户名密码验证策略,passport会自己调用local.strategy中的validate方法
@Post('login')
async login(@Request() req): Promise<any> {
  console.log('3. LocalAuthGuard守卫验证通过');
  // 根据用户的用户名密码验证结果执行不同的操作
  return this.authService.certificate(req.user.data);
}
```


#### 全局守卫 认证
```ts
// 任意的模块中添加
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
],
```

### redis 参考资料
> https://juejin.cn/post/6844903943688945677#heading-13


## 使用缓存
> https://www.cnblogs.com/ajanuw/p/9606456.html



## 使用typeorm是的同步问题
更新了实体entity, 如果比数据库中表的字段少, db中的table数据就会删除了. 
TODO: 查看怎么设置!! synchronize: false... 然后怎么迁移