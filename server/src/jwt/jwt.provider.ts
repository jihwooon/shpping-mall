import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { TokenType } from './token-type.enum'

dotenv.config()

@Injectable()
export class JwtProvider {
  createTokenDTO(email: string) {
    const generateAccessToken = this.generateAccessToken(email)
    const generateRefreshToken = this.generateRefreshToken(email)

    return {
      accessToken: generateAccessToken.accessToken,
      accessTokenExpireTime: generateAccessToken.accessTokenExpireTime,
      refreshToken: generateRefreshToken.refreshToken,
      refreshTokenExpireTime: generateRefreshToken.refreshTokenExpireTime,
    }
  }
  generateAccessToken(email: string) {
    const accessTokenExpireTime = this.createAccessTokenExpireTime()
    const accessToken = this.generateToken(email, accessTokenExpireTime, TokenType.ACCESS)

    return {
      accessToken: accessToken,
      accessTokenExpireTime: accessTokenExpireTime,
    }
  }

  generateRefreshToken(email: string) {
    const refreshTokenExpireTime = this.createRefreshTokenExpireTime()
    const refreshToken = this.generateToken(email, refreshTokenExpireTime, TokenType.REFRESH)

    return {
      refreshToken: refreshToken,
      refreshTokenExpireTime: refreshTokenExpireTime,
    }
  }

  generateToken(email: string, expireTime: Date, tokenType: string) {
    if (email == undefined || email == null || email == '') {
      throw new BadRequestException(`id는 ${email}이 될 수 없습니다`)
    }

    return jwt.sign({ payload: email }, process.env.JWT_SECRET, {
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
