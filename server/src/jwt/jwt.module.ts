import { Module } from '@nestjs/common'
import { JwtProvider } from '../jwt/jwt.provider'

@Module({
  imports: [],
  providers: [JwtProvider],
  exports: [JwtProvider],
})
export class JwtModule {}
