import { Module } from '@nestjs/common'
import { EmailChecker } from './application/email.checker'
import { MemberRepository } from './domain/member.repository'
import { DatabaseModule } from '../database/database.module'
import { PasswordProvider } from './application/password.provider'

@Module({
  imports: [DatabaseModule],
  providers: [EmailChecker, MemberRepository, PasswordProvider],
  exports: [EmailChecker, MemberRepository, PasswordProvider],
})
export class MemberModule {}
