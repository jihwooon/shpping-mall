import { Module } from '@nestjs/common'
import { DatabaseModule } from '../config/database/database.module'
import { MemberModule } from '../members/member.module'
import { SignupController } from './signup/web/signup.controller'
import { SignupService } from './signup/application/signup.service'

@Module({
  imports: [DatabaseModule, MemberModule],
  controllers: [SignupController],
  providers: [SignupService],
})
export class AuthModule {}
