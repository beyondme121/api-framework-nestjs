module.exports = [
  {
    name: 'default',
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: process.env.DB_LOGGING,
    // 启动缓存QueryBuilder, 在QueryBuilder的加上.cache(60000)表示1分钟 , 也可以是Repository
    // cache: {
    //   duration: 30000 // 30s缓存
    // },
    cache: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    // 同步后端代码模型entity和数据库中的表的定义, 不删除数据
    synchronize: true,
    // 会删除表并重建
    dropSchema: false,
    migrations: ['src/migration/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    },
  },
];
