import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { SigninService } from './signin.service'
import { InternalServerErrorException, BadRequestException } from '@nestjs/common'
import { PasswordProvider } from '../../../members/application/password.provider'
import { TokenIssuer } from '../../token/application/token.issuer'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'

describe('Signup class', () => {
  let connect: Connection
  let memberRepository: MemberRepository
  let signinService: SigninService
  let passwordProvider: PasswordProvider

  const EMAIL = 'abc@email.com'
  const NOT_EXISTED_EMAIL = 'notfound@email.com'
  const PASSWORD = '123456'
  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQzNDA2MDQsImV4cCI6MTY5NDQyNzAwNH0.CeU8XsvPM1SWtHVzonZWR-WatmOEVRIXYXpezsyAYfg'
  const REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoxLCJpYXQiOjE2OTQ1MjI0NzUsImV4cCI6MTY5NTczMjA3NSwic3ViIjoiUkVGUkVTSCJ9.A2PfZdj91q6MIapXrvTB6bUd7blhqrrDY2yh0eYdGPY'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        SigninService,
        JwtProvider,
        PasswordProvider,
        TokenIssuer,
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
      ],
    }).compile()

    memberRepository = module.get<MemberRepository>(MemberRepository)
    signinService = module.get<SigninService>(SigninService)
    passwordProvider = module.get<PasswordProvider>(PasswordProvider)
  })

  describe('login method', () => {
    beforeEach(() => {
      memberRepository.findByEmail = jest.fn().mockResolvedValue({
        email: EMAIL,
        memberId: 1,
      })
      passwordProvider.comparePassword = jest.fn().mockResolvedValue(true)
      memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(true)
    })
    context('가입된 회원 정보를 확인하면', () => {
      it('인증을 성공하고, accessToken과 refreshToken을 리턴 해야 한다', async () => {
        const authentication = await signinService.login(EMAIL, PASSWORD)

        expect(authentication).not.toEqual({
          accessToken: ACCESS_TOKEN,
          refreshToken: REFRESH_TOKEN,
        })
      })
      it('인증을 성공하고, accessTokenExpire과 refreshTokenExpire을 리턴 해야 한다', async () => {
        const authentication = await signinService.login(EMAIL, PASSWORD)

        expect(authentication.accessTokenExpireTime).toBeTruthy()
        expect(authentication.refreshTokenExpireTime).toBeTruthy()
      })
    })

    context('찾을 수 없는 이메일이 undefined이면', () => {
      beforeEach(async () => {
        memberRepository.findByEmail = jest.fn().mockResolvedValue(undefined)
      })
      it('MemberNotFoundException을 던져야 한다', async () => {
        expect(signinService.login(NOT_EXISTED_EMAIL, PASSWORD)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })

    context('찾을 수 없는 이메일이 null이면', () => {
      beforeEach(async () => {
        memberRepository.findByEmail = jest.fn().mockResolvedValue(null)
      })
      it('MemberNotFoundException을 던져야 한다', async () => {
        expect(signinService.login(NOT_EXISTED_EMAIL, PASSWORD)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })

    context('찾을 수 없는 패스워드가 주어지면', () => {
      beforeEach(async () => {
        passwordProvider.comparePassword = jest.fn().mockResolvedValue(false)
      })
      it('BadRequestException을 던져야 한다', async () => {
        expect(signinService.login(NOT_EXISTED_EMAIL, PASSWORD)).rejects.toThrow(
          new BadRequestException('패스워드가 일치 하지 않습니다'),
        )
      })
    })

    context('가입 된 회원 정보가 주어지고 token과 만료 기한 변경이 실패하면', () => {
      beforeEach(async () => {
        memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(false)
      })
      it('InternalServerErrorException을 던져야 한다', async () => {
        expect(signinService.login(EMAIL, PASSWORD)).rejects.toThrow(
          new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'),
        )
      })
    })
  })
})
