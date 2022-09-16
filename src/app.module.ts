import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExampleMiddleware } from './example/example.middleware';
import { UsersController } from './users/users.controller';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVER_PORT: Joi.number().default(3000),
        SERVER_MODE: Joi.string().default('dev'),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        SWAGGER_USER: Joi.string().default('admin'),
        SWAGGER_PASSWORD: Joi.string().default('admin'),
        JWT_SECRET_KEY: Joi.string().default('secret'),
      }),
    }),
    CacheModule.register({
      store: redisStore,
      host: '127.0.0.1',
      port: 6379,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  /**
   * MiddlewareConsumer 객체를 통해서 미들웨어를 어디에 적용할 지 관리할 수 있다.
   *
   * */
  configure(consumer: MiddlewareConsumer) {
    /**
     * .apply() - 미들웨어 적용
     * 단일 적용: .apply(ExampleMiddleware)
     * 다중 적용: .apply(ExampleMiddleware, ExampleMiddleware2)
     *
     * .forRoutes() - 미들웨어를 적용할 라우팅 경로 설정
     * 1. 문자열 형식의 경로를 직접 주는 방법: forRoutes.('/users')
     * 2. 컨트롤러 클래스 사용: forRoutes(UsersController)
     * 보통은 2번을 사용하여 미들웨어를 동작하도록 한다.
     *
     * .exclude() - 미들웨어를 적용하지 않을 라우팅 경로 설정
     * .exclude({ path: 'users', method: RequestMethod.GET }, )
     *
     */
    consumer.apply(ExampleMiddleware).forRoutes(UsersController);
  }
}
