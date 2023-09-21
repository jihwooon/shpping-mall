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
    const { email, password, memberName } = request

    const id = await this.signupService.signup(email, password, memberName)

    return {
      id: id,
    }
  }
}
