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



## jwtAuthGuard和RbacGuard中设计的redis的token验证的执行顺序
- 由于jwtAuthGuard定义为全局守卫, 所以流程先流向了 JwtAuthGuard
- 调用 JwtAuthGuard的canActivate方法进行验证, 是否请求是否可以通过
- JwtAuthGuard的canActivate 内部调用了父类的方法 super.canActivate(context); JwtAuthGuard类继承了AuthGuard('jwt')
  - 其中AuthGuard从'@nestjs/passport'导出, passport内部封装了很多策略,比如jwt-strategy
- jwt.strategy.ts中validate方法
- jwtAuthGuard.handleRequest方法
- 然后再走另外一个守卫 @UseGuards(RbacGuard) 验证token是否一致, 如果和redis中保存的一致,就放行
  - 根据key从redis中查找value, 如果匹配不上, 就验证不通过, token失效
- redis中的token过期时间应该和用户登录时certificate签发给用户,返回的token的过期时间保持一致



### TypeORM事务操作
- 事务的4个特性
  - 原子性: 要么都成功, 要么都失败, 失败就回滚到最初的状态
  - 一致性: 转账的例子
  - 隔离性: 每个用户向数据库发起事务, DB都会分配一个隔离的事务, 互相不干扰, T1要么在T2前执行, 要么在T2结束后执行
  - 持久性: 提交的数据就是永久的


- 没有事务带来的问题
  - 脏读: 一个事务读取了另一个事务未提交的数据, 比如别人给我转账, 别人没提交commit, 我就读到了给我转100万, 我就开心了, 然后别人再ROLLBACK, 就没了
  - 不可重复度: 第一次查询是一个值, 另外一个事务更新了这条记录, 我再次查数据时, 数据变更了. 每次查询都是最新的数据. 就是重复度, 数据行可能被别的事务修改
  - 幻读:第一次查询, 没有记录; 另外的事务插入insert一条记录, 你再查询, 数据就出来了.
  - 解决不可重复读的方法是 锁行，解决幻读的方式是 锁表

- 读未提交（Read uncommitted):并发最高，一致性最差的隔离级别, 会有"脏读"
- 读已提交(Read commited): 避免脏读
- 可重复度(Repeatable read): 避免脏读，不可重复读
- 串行化(Serializable): 可避免 脏读、不可重复读、幻读 的发生.  级别最高, 效率最低,锁表的方式使得其他的线程只能在锁外等待

MySQL: 默认: 可重复度
Oracle: 默认: 读已提交；支持串行化, 读已提交



### forEach和for区别
- 内部执行异步的区别
  - for: 等待异步执行完, 再执行for循环后面的同步语句
  - forEach: 不等待forEach内部的异步调用, 直接之后forEach后面的语句
  - 结论: 如果循环中包含了异步调用、并且循环后的同步操作调用了遍历后的结果，应该使用for循环代替forEach
  
```js
async function log(info) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve(`${info}`);
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
}

async function funFor() {
  for (let i = 0; i < 3; i++) {
    let res = await log(`funFor is ${i}`);
    console.log(res);
  }
  console.log('funFor is completed');
}

async function funForEach() {
  [1, 2, 3].forEach(async (item) => {
    let res = await log(`funForEach is ${item}`);
    console.log(res);
  });
  console.log('funForEach is completed');
  funFor();
}
funForEach();
```

权限管理
https://juejin.cn/post/6875858803984695304
https://juejin.cn/post/6844904004984504333
https://www.cnblogs.com/myindex/p/9116177.html

https://juejin.cn/post/6844904165500518414 react-hook


### xampp安装与避坑指南
1. UAC window10问题, 也没有什么办法
2. 设置my.ini给数据库加密码, 然后在这个配置文件中加入如下内容, navicat就可以通过密码连接成功了
3. 也可以直接使用 MYSQL Workbench 使用用户名密码连接
```
# 新增
skip-grant-tables
```



### 用户组
- 给用户组 添加/删除/更新/ 多个用户(传递不同用户id就是更新, 不传递用户id就是删除) => 用户列表 [], [2,3], [2,2,3] => 测试通过
- 删除用户组
  - 软删除用户组  OK
  - 删除用户组与用户关联表的数据 OK
  - 删除用户组与角色关联表的数据


- 给一个用户添加到多个用户组中
  - bug: 如果当前用户id已经有用户组了, 不是bug, 就应该这样, 从userid来看, 就应该是看这个用户能有哪些用户组, 从用户组来看.