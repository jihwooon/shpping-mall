import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../config/database/database.module'
import { TokenController } from './web/token.controller'
import { TokenIssuer } from './application/token.issuer'
import { MemberModule } from '../../members/member.module'
import { JwtModule } from '../../jwt/jwt.module'

@Module({
  imports: [DatabaseModule, MemberModule, JwtModule],
  controllers: [TokenController],
  providers: [TokenIssuer],
  exports: [TokenIssuer],
})
export class TokenModule {}
