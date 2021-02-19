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
- 启动cmd, 输入 redis-server 就可以启动redis的服务端了
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




