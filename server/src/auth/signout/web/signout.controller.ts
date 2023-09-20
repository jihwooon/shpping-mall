import { Controller, Headers, HttpCode, Post, Res } from '@nestjs/common'
import { SignoutService } from '../application/signout.service'
import { Response } from 'express'

@Controller('auth')
export class SignoutController {
  constructor(private readonly signoutService: SignoutService) {}

  @Post('signout')
  @HttpCode(200)
  async signoutHandler(@Headers() headers: any, @Res() response: Response) {
    const accessToken = headers.authorization.split('Bearer ')[1]

    await this.signoutService.logout(accessToken)

    return response.json('logout success')
  }
}
