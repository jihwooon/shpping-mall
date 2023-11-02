import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { MemberModule } from '../../members/member.module'
import { JwtModule } from '../../jwt/jwt.module'
import { SignupService } from './application/signup.service'
import { SignupController } from './web/signup.controller'

@Module({
  imports: [DatabaseModule, MemberModule, JwtModule],
  controllers: [SignupController],
  providers: [SignupService],
  exports: [SignupService],
})
export class SignupModule {}
