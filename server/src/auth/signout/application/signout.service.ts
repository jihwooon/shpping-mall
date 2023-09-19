import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { TokenExpiredException } from '../../token/error/token_expired.exception'
import { TokenType } from '../../../jwt/token-type.enum'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'
import { NotAccessTokenTypeException } from '../../token/error/not-access-token-type.exception'

@Injectable()
export class SignoutService {
  constructor(private readonly memberRepository: MemberRepository, private readonly jwtProvider: JwtProvider) {}

  async logout(accessToken: string): Promise<boolean> {
    const { expirationTime, subject, payload, audience } = await this.jwtProvider.validateToken(accessToken)
    const email = audience.toString()

    if (expirationTime < Date.now()) {
      throw new TokenExpiredException('AccessToken 유효기간이 만료되었습니다')
    }

    if (subject != TokenType.ACCESS) {
      throw new NotAccessTokenTypeException('AccessToken Type이 아닙니다')
    }

    const member = await this.memberRepository.findByEmail(email)
    if (!member) {
      throw new MemberNotFoundException('회원 정보를 찾을 수 없습니다')
    }

    const expiredToken = this.jwtProvider.expiredRefreshToken(member.email, new Date())

    const updatedRefreshToken = await this.memberRepository.updateMemberByRefreshTokenAndExpirationTime(
      expiredToken.refreshToken,
      expiredToken.refreshTokenExpireTime,
      member.email,
    )

    if (!updatedRefreshToken) {
      throw new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다')
    }

    return updatedRefreshToken
  }
}
