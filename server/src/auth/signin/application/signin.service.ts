import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { Authentication } from '../../../jwt/dto/authentication'
import { PasswordProvider } from '../../../members/application/password.provider'
import { Member } from '../../../members/domain/member.entity'

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
      throw new BadRequestException('패스워드가 일치 하지 않습니다')
    }

    const generateToken = this.jwtProvider.createTokenDTO(member.email)
    await this.updateRefreshTokenAndExpirationTime(generateToken, member)

    return {
      accessToken: generateToken.accessToken,
      accessTokenExpireTime: generateToken.accessTokenExpireTime,
      refreshToken: generateToken.refreshToken,
      refreshTokenExpireTime: generateToken.refreshTokenExpireTime,
    }
  }

  async updateRefreshTokenAndExpirationTime(generateToken: any, member: Member) {
    await this.memberRepository.updateMemberByRefreshTokenAndExpirationTime(
      generateToken.refreshToken,
      generateToken.refreshTokenExpireTime,
      member.email,
    )
  }
}
