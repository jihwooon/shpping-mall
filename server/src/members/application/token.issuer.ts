import { Injectable } from '@nestjs/common'
import { MemberRepository } from '../domain/member.repository'
import { RefreshTokenNotFoundException } from './error/refresh-token-not-found.exception'
import { JwtProvider } from '../../jwt/jwt.provider'
import { AccessTokenDto } from '../dto/access-token.dto'

@Injectable()
export class TokenIssuer {
  constructor(private readonly memberRepository: MemberRepository, private readonly jwtProvider: JwtProvider) {}

  async createAccessTokenByRefreshToken(refreshToken: string, now: Date): Promise<AccessTokenDto> {
    const member = await this.memberRepository.findMemberByRefreshToken(refreshToken)

    if (!member) {
      throw new RefreshTokenNotFoundException('Refresh Token 정보를 찾을 수 없습니다')
    }

    const generateAccessToken = this.jwtProvider.generateAccessToken(member.email)

    return {
      accessToken: generateAccessToken.accessToken,
      accessTokenExpireTime: generateAccessToken.accessTokenExpireTime,
    }
  }
}
