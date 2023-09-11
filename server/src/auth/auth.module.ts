import { Module } from '@nestjs/common'
import { DatabaseModule } from '../config/database/database.module'
import { MemberModule } from '../members/member.module'
import { SignupController } from './signup/web/signup.controller'
import { SignupService } from './signup/application/signup.service'
import { JwtProvider } from '../jwt/jwt.provider'
import { SigninController } from './signin/web/signin.controller'
import { SigninService } from './signin/application/signin.service'

@Module({
  imports: [DatabaseModule, MemberModule],
  controllers: [SignupController, SigninController],
  providers: [SignupService, SigninService, JwtProvider],
})
export class AuthModule {}
