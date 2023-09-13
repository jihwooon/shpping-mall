import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

@Injectable()
export class JwtProvider {
  generateAccessToken(id: number, expireTime: Date) {
    if (id == undefined || id == null) {
      throw new BadRequestException(`id는 ${id}이 될 수 없습니다`)
    }

    return jwt.sign({ payload: id }, process.env.ACCESS_JWT_SECRET, {
      subject: 'ACCESS',
      expiresIn: expireTime.getMilliseconds(),
    })
  }

  generateRefreshToken(id: number, expireTime: Date) {
    if (id == undefined || id == null) {
      throw new BadRequestException(`id는 ${id}이 될 수 없습니다`)
    }

    return jwt.sign({ payload: id }, process.env.REFRESH_JWT_SECRET, {
      subject: 'REFRESH',
      expiresIn: expireTime.getMilliseconds(),
    })
  }

  validateToken(token: string): number {
    if (token == null || token == undefined || token == '') {
      throw new BadRequestException(`token는 ${token}이 될 수 없습니다`)
    }

    try {
      const { payload } = jwt.verify(token, process.env.ACCESS_JWT_SECRET) as jwt.JwtPayload

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
