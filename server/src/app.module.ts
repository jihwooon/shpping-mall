import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { ItemModule } from './items/item.module'
import { AuthModule } from './auth/auth.module'
import { ExceptionModule } from './config/error/exception.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    AuthModule,
    ItemModule,
    ExceptionModule,
    RouterModule.register([
      {
        path: 'admin',
        module: ItemModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
