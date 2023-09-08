import { Test, TestingModule } from '@nestjs/testing'
import { SignupController } from './signup.controller'

import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { EmailChecker } from '../../../members/application/email.checker'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { CREATE_MEMBER_REQUEST } from '../../../fixture/memberFixture'
import { SignupService } from '../application/signup.service'
import { PasswordProvider } from '../../../members/application/password.provider'

describe('SignupController class', () => {
  let signupController: SignupController
  let signupService: SignupService
  let connection: Connection

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SignupController],
      providers: [
        SignupService,
        EmailChecker,
        MemberRepository,
        PasswordProvider,
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
      signupService.signup = jest.fn().mockImplementation(() => 1)
    })
    context('회원가입 정보 요청이 주어지고, 회원가입 정보 저장 후', () => {
      it('id를 리턴해야 한다', async () => {
        const signedMember = await signupController.signupHandler(CREATE_MEMBER_REQUEST)

        expect(signedMember).toEqual(1)
      })
    })
  })
})
