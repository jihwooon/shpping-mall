import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { TokenType } from './token-type.enum'

dotenv.config()

@Injectable()
export class JwtProvider {
  generateAccessToken(id: number) {
    const accessTokenExpireTime = this.createAccessTokenExpireTime()
    const accessToken = this.generateToken(id, accessTokenExpireTime, TokenType.ACCESS)

    return {
      accessToken: accessToken,
      accessTokenExpireTime: accessTokenExpireTime,
    }
  }

  generateRefreshToken(id: number) {
    const refreshTokenExpireTime = this.createRefreshTokenExpireTime()
    const refreshToken = this.generateToken(id, refreshTokenExpireTime, TokenType.REFRESH)

    return {
      refreshToken: refreshToken,
      refreshTokenExpireTime: refreshTokenExpireTime,
    }
  }

  generateToken(id: number, expireTime: Date, tokenType: string) {
    if (id == undefined || id == null) {
      throw new BadRequestException(`id는 ${id}이 될 수 없습니다`)
    }

    return jwt.sign({ payload: id }, process.env.JWT_SECRET, {
      subject: tokenType,
      expiresIn: expireTime.getMilliseconds(),
    })
  }

  validateToken(token: string): number {
    if (token == null || token == undefined || token == '') {
      throw new BadRequestException(`token는 ${token}이 될 수 없습니다`)
    }

    try {
      const { payload } = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload

      return payload
    } catch (e) {
      throw new UnauthorizedException('인증 할 수 없는 token 입니다')
    }
  }

  createAccessTokenExpireTime() {
    return new Date(Date.now() + 86400000)
  }

  createRefreshTokenExpireTime() {
    return new Date(Date.now() + 1210500000)
  }
}
