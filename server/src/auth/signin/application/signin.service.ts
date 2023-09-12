import { Injectable, NotFoundException } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { Authentication } from '../../../jwt/dto/authentication'
import { PasswordProvider } from '../../../members/application/password.provider'

@Injectable()
export class SigninService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly jwtProvider: JwtProvider,
    private readonly passwordProvider: PasswordProvider,
  ) {}

  async login(email: string, password: string): Promise<Authentication> {
    const member = await this.memberRepository.findByEmail(email)
    if (!member) {
      throw new NotFoundException('회원 정보를 찾을 수 없습니다')
    }

    const isPasswordMatch = await this.passwordProvider.comparePassword(password, member)
    if (!isPasswordMatch) {
      throw new NotFoundException('회원 정보를 찾을 수 없습니다')
    }

    return {
      accessToken: this.jwtProvider.generateAccessToken(member.memberId),
    }
  }
}
