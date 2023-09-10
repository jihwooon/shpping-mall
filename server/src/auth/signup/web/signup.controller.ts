import { SignupService } from '../application/signup.service'
import { CreateMemberDto } from '../../../members/dto/create-member.dto'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { SignupResponseDto } from '../dto/signup-response.dto'

@Controller('auth')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('signup')
  @HttpCode(201)
  async signupHandler(@Body() request: CreateMemberDto): Promise<SignupResponseDto> {
    const response = await this.signupService.signup(request.email, request.password, request.memberName)
    return {
      accessToken: response.accessToken,
    }
  }
}
