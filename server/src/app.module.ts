import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
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
})
export class AppModule {}
