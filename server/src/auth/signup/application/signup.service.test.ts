import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { EmailChecker } from '../../../members/application/email.checker'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { SignupService } from './signup.service'
import { PasswordProvider } from '../../../members/application/password.provider'
import { JwtProvider } from '../../../jwt/jwt.provider'

describe('Signup class', () => {
  let connect: Connection
  let memberRepository: MemberRepository
  let emailChecker: EmailChecker
  let signupService: SignupService
  let jwtProvider: JwtProvider

  const EMAIL = 'abc@email.com'
  const PASSWORD = '123456'
  const NAME = '홍길동'
  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQzNDA2MDQsImV4cCI6MTY5NDQyNzAwNH0.CeU8XsvPM1SWtHVzonZWR-WatmOEVRIXYXpezsyAYfg'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        SignupService,
        EmailChecker,
        PasswordProvider,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
      ],
    }).compile()

    memberRepository = module.get<MemberRepository>(MemberRepository)
    emailChecker = module.get<EmailChecker>(EmailChecker)
    signupService = module.get<SignupService>(SignupService)
    jwtProvider = module.get<JwtProvider>(JwtProvider)
  })

  describe('sinup method', () => {
    beforeEach(async () => {
      emailChecker.checkDuplicatedEmail = jest.fn().mockResolvedValue(undefined)
      memberRepository.save = jest.fn().mockImplementation(() => 1)
    })

    context('회원가입 정보 저장이 되면', () => {
      it('accessToken을 리턴 해야 한다', async () => {
        const authentication = await signupService.signup(EMAIL, PASSWORD, NAME)

        expect(authentication).not.toEqual({
          accessToken: ACCESS_TOKEN,
        })
      })
    })
  })
})
