import { Injectable } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { EmailChecker } from '../../../members/application/email.checker'
import { Member } from '../../../members/domain/member.entity'
import { PasswordProvider } from '../../../members/application/password.provider'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { Authentication } from '../../../jwt/dto/authentication'

@Injectable()
export class SignupService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly emailChecker: EmailChecker,
    private readonly passwordProvider: PasswordProvider,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async signup(email: string, password: string, memberName: string): Promise<Authentication> {
    await this.emailChecker.checkDuplicatedEmail(email)
    const hashedPassword = await this.passwordProvider.hashPassword(password)
    const id = await this.memberRepository.save(
      new Member({ email: email, password: hashedPassword, memberName: memberName }),
    )

    return {
      accessToken: this.jwtProvider.generateAccessToken(id),
    }
  }
}
