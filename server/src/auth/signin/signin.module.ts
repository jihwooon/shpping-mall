import { Module } from '@nestjs/common'
import { SigninService } from './application/signin.service'
import { SigninController } from './web/signin.controller'
import { DatabaseModule } from '../../database/database.module'
import { MemberModule } from '../../members/member.module'
import { JwtModule } from '../../jwt/jwt.module'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [DatabaseModule, MemberModule, JwtModule, TokenModule],
  controllers: [SigninController],
  providers: [SigninService],
  exports: [SigninService],
})
export class SigninModule {}
