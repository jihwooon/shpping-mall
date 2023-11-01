import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../config/database/database.module'
import { MemberModule } from '../../members/member.module'
import { JwtModule } from '../../jwt/jwt.module'
import { SignoutService } from './application/signout.service'
import { SignoutController } from './web/signout.controller'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [DatabaseModule, MemberModule, JwtModule, TokenModule],
  controllers: [SignoutController],
  providers: [SignoutService],
  exports: [SignoutService],
})
export class SignoutModule {}
