import { Controller, HttpCode, Post, Req } from '@nestjs/common'
import { SigninService } from '../application/signin.service'
import { SigninResponseDto } from '../dto/signin-response.dto'

@Controller('auth')
export class SigninController {
  constructor(private readonly signinService: SigninService) {}

  @Post('signin')
  @HttpCode(200)
  async signinHandler(@Req() req: any): Promise<SigninResponseDto> {
    const { email, password } = req.body

    const response = await this.signinService.login(email, password)

    return {
      accessToken: response.accessToken,
    }
  }
}
