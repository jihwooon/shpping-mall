import { Injectable } from '@nestjs/common'
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
}
