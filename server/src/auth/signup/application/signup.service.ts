import { Injectable } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { EmailChecker } from '../../../members/application/email.checker'
import { Member } from '../../../members/domain/member.entity'
import { PasswordProvider } from '../../../members/application/password.provider'

@Injectable()
export class SignupService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly emailChecker: EmailChecker,
    private readonly passwordProvider: PasswordProvider,
  ) {}

  async signup(email: string, password: string, memberName: string): Promise<number> {
    await this.emailChecker.checkDuplicatedEmail(email)
    const hashedPassword = await this.passwordProvider.hashPassword(password)

    return await this.memberRepository.save(
      new Member({ email: email, password: hashedPassword, memberName: memberName }),
    )
  }
}
