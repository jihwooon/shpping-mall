import { Module } from '@nestjs/common'
import { EmailChecker } from './application/email.checker'
import { MemberRepository } from './domain/member.repository'
import { DatabaseModule } from '../config/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [EmailChecker, MemberRepository],
  exports: [EmailChecker, MemberRepository],
})
export class MemberModule {}
