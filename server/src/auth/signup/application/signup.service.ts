import { Injectable } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { EmailChecker } from '../../../members/application/email.checker'
import { Member } from '../../../members/domain/member.entity'

@Injectable()
export class SignupService {
  constructor(private readonly memberRepository: MemberRepository, private readonly emailChecker: EmailChecker) {}

  async signup(email: string, password: string, memberName: string): Promise<number> {
    await this.emailChecker.checkDuplicatedEmail(email)

    return await this.memberRepository.save(new Member({ email: email, password: password, memberName: memberName }))
  }
}
