import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MYSQL_CONNECTION } from '../../database/constants'
import { MemberRepository } from '../domain/member.repository'
import { EmailChecker } from './email.checker'
import { AlreadyExistedEmailException } from './error/already-existed-email.exception'

describe('EmailChecker class', () => {
  let connect: Connection
  let memberRepository: MemberRepository
  let emailChecker: EmailChecker
  const SUBSCRIBED_EMAIL = 'abc@email.com'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        EmailChecker,
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
      ],
    }).compile()

    memberRepository = module.get<MemberRepository>(MemberRepository)
    emailChecker = module.get<EmailChecker>(EmailChecker)
  })

  describe('duplicatedEmailCheck method', () => {
    context('이미 가입된 이메일이 주어지면', () => {
      beforeEach(() => {
        memberRepository.existsByEmail = jest.fn().mockResolvedValue(true)
      })

      it('BadRequestException를 던져야 한다.', async () => {
        expect(emailChecker.checkDuplicatedEmail(SUBSCRIBED_EMAIL)).rejects.toThrow(
          new AlreadyExistedEmailException('동일한 이메일이 이미 존재합니다'),
        )
      })
    })
  })
})
