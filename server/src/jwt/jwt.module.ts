import { Module } from '@nestjs/common'
import { DatabaseModule } from '../config/database/database.module'
import { JwtProvider } from '../jwt/jwt.provider'

@Module({
  imports: [DatabaseModule],
  providers: [JwtProvider],
  exports: [JwtProvider],
})
export class JwtModule {}
