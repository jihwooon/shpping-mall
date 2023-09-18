import { Injectable } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { AccessTokenDto } from '../dto/access-token.dto'
import { TokenExpiredException } from '../error/token_expired.exception'

@Injectable()
export class TokenIssuer {
  constructor(private readonly memberRepository: MemberRepository, private readonly jwtProvider: JwtProvider) {}

  async createAccessTokenByRefreshToken(refreshToken: string, now: Date): Promise<AccessTokenDto> {
    const member = await this.memberRepository.findMemberByRefreshToken(refreshToken)

    if (!member) {
      throw new MemberNotFoundException('회원 정보를 찾을 수 없습니다')
    }

    if (member.tokenExpirationTime < now) {
      throw new TokenExpiredException('Refresh Token의 유효기간이 만료되었습니다')
    }

    const generateAccessToken = this.jwtProvider.generateAccessToken(member.email)

    return {
      accessToken: generateAccessToken.accessToken,
      accessTokenExpireTime: generateAccessToken.accessTokenExpireTime,
    }
  }
}
