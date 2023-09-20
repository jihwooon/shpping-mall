import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { AccessTokenDto } from '../dto/access-token.dto'
import { TokenExpiredException } from '../error/token_expired.exception'
import { Member } from '../../../members/domain/member.entity'

@Injectable()
export class TokenIssuer {
  constructor(private readonly memberRepository: MemberRepository, private readonly jwtProvider: JwtProvider) {}

  async createAccessTokenByRefreshToken(refreshToken: string, now: Date): Promise<AccessTokenDto> {
    this.jwtProvider.validateToken(refreshToken)
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

  async updateRefreshTokenAndExpirationTime(generateToken: any, member: Member): Promise<boolean> {
    const updatedRefreshToken = await this.memberRepository.updateMemberByRefreshTokenAndExpirationTime(
      generateToken.refreshToken,
      generateToken.refreshTokenExpireTime,
      member.email,
    )

    if (!updatedRefreshToken) {
      throw new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다')
    }

    return updatedRefreshToken
  }
}
