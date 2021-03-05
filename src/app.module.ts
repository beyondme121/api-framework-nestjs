import * as path from 'path';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as redisStore from 'cache-manager-redis-store';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisUtilModule } from './modules/redis-utils/redis.module';
import { UserModule } from './modules/admin/user/user.module';
import { AuthModule } from './modules/admin/auth/auth.module';
import { RoleModule } from './modules/admin/role/role.module';
import { AccessModule } from './modules/admin/access/access.module';

@Module({
  imports: [
    // 配置加载配置文件
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}'), {
      modifyConfigName: (name) => name.replace('.config', ''),
    }),
    // mysql的连接
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: config.get('database.type'),
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        subscribers: [__dirname + './../subscribers/*.subscriber{.ts,.js}'],
        logging: config.get('database.logging'),
        timezone: '+08:00', // 东八区
        autoLoadModels: true,
      }),
      inject: [ConfigService],
    }),
    // 内置缓存设置
    // CacheModule.register({
    //   ttl: 50,
    //   max: 1000,
    // }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // default value
      port: 6379, // default value
      auth_pass: '123456',
      db: 0,
      ttl: 600,
    }),
    // TypeOrmModule.forRoot(),
    RedisUtilModule,
    UserModule,
    AuthModule,
    RoleModule,
    AccessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
