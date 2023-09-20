import { BadRequestException, Injectable } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { Authentication } from '../../../jwt/dto/authentication'
import { PasswordProvider } from '../../../members/application/password.provider'
import { TokenIssuer } from '../../token/application/token.issuer'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'

@Injectable()
export class SigninService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly jwtProvider: JwtProvider,
    private readonly passwordProvider: PasswordProvider,
    private readonly tokenIssuer: TokenIssuer,
  ) {}

  async login(email: string, password: string): Promise<Authentication> {
    const member = await this.memberRepository.findByEmail(email)
    if (!member) {
      throw new MemberNotFoundException('회원 정보를 찾을 수 없습니다')
    }

    const isPasswordMatch = await this.passwordProvider.comparePassword(password, member)
    if (!isPasswordMatch) {
      throw new BadRequestException('패스워드가 일치 하지 않습니다')
    }

    const { accessToken, accessTokenExpireTime, refreshToken, refreshTokenExpireTime } =
      this.jwtProvider.createTokenDTO(member.email)
    await this.tokenIssuer.updateRefreshTokenAndExpirationTime({ refreshToken, refreshTokenExpireTime }, member)

    return {
      accessToken: accessToken,
      accessTokenExpireTime: accessTokenExpireTime,
      refreshToken: refreshToken,
      refreshTokenExpireTime: refreshTokenExpireTime,
    }
  }
}
