import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { EmailChecker } from '../../../members/application/email.checker'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { SignupService } from './signup.service'
import { PasswordProvider } from '../../../members/application/password.provider'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { userMock } from '../../../fixture/memberFixture'

describe('Signup class', () => {
  let connect: Connection
  let memberRepository: MemberRepository
  let signupService: SignupService
  let emailChecker: EmailChecker

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
  })

  describe('sinup method', () => {
    beforeEach(async () => {
      emailChecker.checkDuplicatedEmail = jest.fn().mockResolvedValue(undefined)
      memberRepository.save = jest.fn().mockImplementation(() => userMock().memberId)
    })

    context('회원가입 정보 저장이 되면', () => {
      it('저장 된 id 값을 리턴해야 한다', async () => {
        const id = await signupService.signup(userMock().email, userMock().password, userMock().memberName)

        expect(id).toEqual(userMock().memberId)
      })
    })
  })
})
