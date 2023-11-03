import { Test, TestingModule } from '@nestjs/testing'
import { SignupController } from './signup.controller'

import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { EmailChecker } from '../../../members/application/email.checker'
import { MYSQL_CONNECTION } from '../../../database/constants'
import { userMock } from '../../../../fixture/memberFixture'
import { SignupService } from '../application/signup.service'
import { PasswordProvider } from '../../../members/application/password.provider'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { CreateMemberDto } from '../../../members/dto/create-member.dto'
import { SignupResponseDto } from '../dto/signup-response.dto'

describe('SignupController class', () => {
  let signupController: SignupController
  let connection: Connection
  let signupService: SignupService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SignupController],
      providers: [
        SignupService,
        EmailChecker,
        MemberRepository,
        PasswordProvider,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    signupController = app.get<SignupController>(SignupController)
    signupService = app.get<SignupService>(SignupService)
  })

  describe('signupHandler method', () => {
    beforeEach(() => {
      signupService.signup = jest.fn().mockResolvedValue(userMock().memberId)
    })
    context('회원가입 정보 요청이 주어지고, 회원가입 정보 저장 후', () => {
      it('저장 된 id 값을 리턴 해야 한다', async () => {
        const signupRequest: CreateMemberDto = {
          email: userMock().email,
          password: userMock().password,
          memberName: userMock().memberName,
        }
        const signupResponse: SignupResponseDto = {
          id: userMock().memberId,
        }

        const id = await signupController.signupHandler(signupRequest)

        expect(id).toEqual(signupResponse)
      })
    })
  })
})
