import { Module } from '@nestjs/common'
import { SigninModule } from './signin/signin.module'
import { SignoutModule } from './signout/signout.module'
import { SignupModule } from './signup/signup.module'

@Module({
  imports: [SigninModule, SignoutModule, SignupModule],
})
export class AuthModule {}
