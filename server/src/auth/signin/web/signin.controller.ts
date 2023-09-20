import { Controller, HttpCode, Post, Body } from '@nestjs/common'
import { SigninService } from '../application/signin.service'
import { SigninResponseDto } from '../dto/signin-response.dto'
import { LoginMemberDto } from '../../../members/dto/login-member.dto'

@Controller('auth')
export class SigninController {
  constructor(private readonly signinService: SigninService) {}

  @Post('signin')
  @HttpCode(200)
  async signinHandler(@Body() request: LoginMemberDto): Promise<SigninResponseDto> {
    const { email, password } = request

    const { accessToken, refreshToken, accessTokenExpireTime, refreshTokenExpireTime } = await this.signinService.login(
      email,
      password,
    )

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpireTime: accessTokenExpireTime,
      refreshTokenExpireTime: refreshTokenExpireTime,
    }
  }
}
