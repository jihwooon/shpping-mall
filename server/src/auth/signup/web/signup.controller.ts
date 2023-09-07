import { SignupService } from '../application/signup.service'
import { CreateMemberDto } from '../../../members/dto/create-member.dto'
import { Controller, Post, HttpCode, Body } from '@nestjs/common'

@Controller('auth')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('signup')
  @HttpCode(201)
  async signupHandler(@Body() request: CreateMemberDto): Promise<number> {
    return await this.signupService.signup(request.email, request.password, request.memberName)
  }
}
