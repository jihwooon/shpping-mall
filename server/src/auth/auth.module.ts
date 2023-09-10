import { Module } from '@nestjs/common'
import { DatabaseModule } from '../config/database/database.module'
import { MemberModule } from '../members/member.module'
import { SignupController } from './signup/web/signup.controller'
import { SignupService } from './signup/application/signup.service'
import { JwtProvider } from '../jwt/jwt.provider'

@Module({
  imports: [DatabaseModule, MemberModule],
  controllers: [SignupController],
  providers: [SignupService, JwtProvider],
})
export class AuthModule {}
