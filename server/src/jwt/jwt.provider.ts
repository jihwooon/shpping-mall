import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { TokenType } from './token-type.enum'
import { Role } from '../members/domain/member-role.enum'

dotenv.config()

@Injectable()
export class JwtProvider {
  createTokenDTO(email: string, role: Role) {
    const generateAccessToken = this.generateAccessToken(email, role)
    const generateRefreshToken = this.generateRefreshToken(email)

    return {
      accessToken: generateAccessToken.accessToken,
      accessTokenExpireTime: generateAccessToken.accessTokenExpireTime,
      refreshToken: generateRefreshToken.refreshToken,
      refreshTokenExpireTime: generateRefreshToken.refreshTokenExpireTime,
    }
  }
  generateAccessToken(email: string, role: Role) {
    const accessTokenExpireTime = this.createAccessTokenExpireTime()
    const payload = {
      email: email,
      role: role,
    }
    const accessToken = this.generateToken(payload, accessTokenExpireTime, TokenType.ACCESS)

    return {
      accessToken: accessToken,
      accessTokenExpireTime: accessTokenExpireTime,
    }
  }

  generateRefreshToken(email: string) {
    const refreshTokenExpireTime = this.createRefreshTokenExpireTime()
    const payload = {
      email: email,
    }
    const refreshToken = this.generateToken(payload, refreshTokenExpireTime, TokenType.REFRESH)

    return {
      refreshToken: refreshToken,
      refreshTokenExpireTime: refreshTokenExpireTime,
    }
  }

  generateToken(payload: object, expireTime: Date, tokenType: string) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      subject: tokenType,
      expiresIn: expireTime.getTime() - 1728000000 + 30970630,
    })
  }

  validateToken(token: string) {
    if (token == null || token == undefined || token == '') {
      throw new BadRequestException(`token는 ${token}이 될 수 없습니다`)
    }

    try {
      const { email, role, iat, exp, sub } = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload

      return {
        email: email,
        role: role,
        iat: iat,
        exp: exp,
        sub: sub,
      }
    } catch (e) {
      throw new UnauthorizedException('인증 할 수 없는 token 입니다')
    }
  }

  expiredRefreshToken(email: string, now: Date) {
    const payload = {
      email: email,
    }

    const refreshToken = this.generateToken(payload, now, TokenType.REFRESH)

    return {
      refreshToken: refreshToken,
      refreshTokenExpireTime: now,
    }
  }

  createAccessTokenExpireTime() {
    return new Date(Date.now() + 86400000)
  }

  createRefreshTokenExpireTime() {
    return new Date(Date.now() + 1210500000)
  }
}
