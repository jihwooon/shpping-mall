import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { EmailChecker } from '../../../members/application/email.checker'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { SignupService } from './signup.service'

describe('Signup class', () => {
  let connect: Connection
  let memberRepository: MemberRepository
  let emailChecker: EmailChecker
  let signupService: SignupService

  const EMAIL = 'abc@email.com'
  const PASSWORD = '123456'
  const NAME = '홍길동'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        SignupService,
        EmailChecker,
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
      ],
    }).compile()

    memberRepository = module.get<MemberRepository>(MemberRepository)
    emailChecker = module.get<EmailChecker>(EmailChecker)
    signupService = module.get<SignupService>(SignupService)
  })

  describe('sinup method', () => {
    context('회원가입 정보 저장이 되면', () => {
      beforeEach(() => {
        emailChecker.checkDuplicatedEmail = jest.fn().mockResolvedValue(undefined)
        memberRepository.save = jest.fn().mockImplementation(() => 1)
      })

      it('id를 리턴해야 한다', async () => {
        const member = await signupService.signup(EMAIL, PASSWORD, NAME)
        expect(member).toBe(1)
      })
    })
  })
})
