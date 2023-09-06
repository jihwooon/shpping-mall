import { Module } from '@nestjs/common'
import { EmailChecker } from './application/email.checker'

@Module({
  providers: [EmailChecker],
  exports: [EmailChecker],
})
export class MemberModule {}
