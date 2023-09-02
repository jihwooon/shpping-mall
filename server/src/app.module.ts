import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { ItemModule } from './items/item.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),

    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
