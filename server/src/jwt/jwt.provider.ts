import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

@Injectable()
export class JwtProvider {
  generateAccessToken(id: number) {
    return jwt.sign({ payload: id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
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
}
