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
    const response = await this.signinService.login(request.email, request.password)

    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    }
  }
}
