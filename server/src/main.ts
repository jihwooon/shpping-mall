import * as http from 'http'
import * as express from 'express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const server = express()
  const adapter = new ExpressAdapter(server)
  const app = await NestFactory.create(AppModule, adapter, {
    cors: true,
    logger: ['log', 'error', 'warn', 'debug'],
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const PORT = process.env.PORT ?? 8080

  http.createServer(server).listen(PORT)
  console.info('server is running on', PORT)
}
bootstrap()
