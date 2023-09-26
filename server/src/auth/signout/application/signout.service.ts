import { Injectable } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { TokenExpiredException } from '../../token/error/token_expired.exception'
import { TokenType } from '../../../jwt/token-type.enum'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'
import { NotAccessTokenTypeException } from '../../token/error/not-access-token-type.exception'
import { TokenIssuer } from '../../token/application/token.issuer'

@Injectable()
export class SignoutService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly jwtProvider: JwtProvider,
    private readonly tokenIssuer: TokenIssuer,
  ) {}

  async logout(accessToken: string): Promise<boolean> {
    const { exp, sub, email } = await this.jwtProvider.validateToken(accessToken)

    if (exp < Date.now()) {
      throw new TokenExpiredException('AccessToken 유효기간이 만료되었습니다')
    }

    if (sub != TokenType.ACCESS) {
      throw new NotAccessTokenTypeException('AccessToken Type이 아닙니다')
    }

    const member = await this.memberRepository.findByEmail(email)
    if (!member) {
      throw new MemberNotFoundException('회원 정보를 찾을 수 없습니다')
    }

    const expiredToken = this.jwtProvider.expiredRefreshToken(member.email, new Date())
    const updatedRefreshToken = await this.tokenIssuer.updateRefreshTokenAndExpirationTime(expiredToken, member)

    return updatedRefreshToken
  }
}
