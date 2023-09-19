import { Module } from '@nestjs/common'
import { DatabaseModule } from '../config/database/database.module'
import { MemberModule } from '../members/member.module'
import { SignupController } from './signup/web/signup.controller'
import { SignupService } from './signup/application/signup.service'
import { JwtProvider } from '../jwt/jwt.provider'
import { SigninController } from './signin/web/signin.controller'
import { SigninService } from './signin/application/signin.service'
import { TokenController } from './token/web/token.controller'
import { TokenIssuer } from './token/application/token.issuer'
import { SignoutService } from './signout/application/signout.service'
import { SignoutController } from './signout/web/signout.controller'

@Module({
  imports: [DatabaseModule, MemberModule],
  controllers: [SignupController, SigninController, TokenController, SignoutController],
  providers: [SignupService, SigninService, JwtProvider, TokenIssuer, SignoutService],
})
export class AuthModule {}
