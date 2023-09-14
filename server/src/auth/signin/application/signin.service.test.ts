import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { SigninService } from './signin.service'
import { NotFoundException } from '@nestjs/common'
import { PasswordProvider } from '../../../members/application/password.provider'
import { MEMBER } from '../../../fixture/memberFixture'

describe('Signup class', () => {
  let connect: Connection
  let memberRepository: MemberRepository
  let signinService: SigninService
  let passwordProvider: PasswordProvider
  let jwtProvider: JwtProvider

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
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
      ],
    }).compile()

    memberRepository = module.get<MemberRepository>(MemberRepository)
    signinService = module.get<SigninService>(SigninService)
    passwordProvider = module.get<PasswordProvider>(PasswordProvider)
    jwtProvider = module.get<JwtProvider>(JwtProvider)
  })

  describe('login method', () => {
    beforeEach(() => {
      memberRepository.findByEmail = jest.fn().mockResolvedValue({
        email: EMAIL,
        memberId: 1,
      })
      passwordProvider.comparePassword = jest.fn().mockResolvedValue(true)
      memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockImplementation()
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
      it('NotFoundException을 던져야 한다', async () => {
        expect(signinService.login(NOT_EXISTED_EMAIL, PASSWORD)).rejects.toThrow(
          new NotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })

    context('찾을 수 없는 이메일이 null이면', () => {
      beforeEach(async () => {
        memberRepository.findByEmail = jest.fn().mockResolvedValue(null)
      })
      it('NotFoundException을 던져야 한다', async () => {
        expect(signinService.login(NOT_EXISTED_EMAIL, PASSWORD)).rejects.toThrow(
          new NotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })

    context('찾을 수 없는 패스워드가 주어지면', () => {
      beforeEach(async () => {
        memberRepository.findByEmail = jest.fn().mockResolvedValue(undefined)
        passwordProvider.comparePassword = jest.fn().mockResolvedValue(false)
      })
      it('NotFoundException을 던져야 한다', async () => {
        expect(signinService.login(NOT_EXISTED_EMAIL, PASSWORD)).rejects.toThrow(
          new NotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })
  })

  describe('updateRefreshTokenAndExpirationTime method', () => {
    context('refreshToken과 사용자 정보가 주어지면', () => {
      it('메서드를 호출해야 한다 ', async () => {
        const spyOn = jest.spyOn(signinService, 'updateRefreshTokenAndExpirationTime').mockResolvedValue()
        await signinService.updateRefreshTokenAndExpirationTime(
          {
            refreshToken: REFRESH_TOKEN,
            refreshTokenExpireTime: new Date('2023-09-28T14:45:55.144Z'),
          },
          MEMBER,
        )

        expect(spyOn).toHaveBeenCalled()
        expect(spyOn).toHaveBeenCalledWith(
          {
            refreshToken: REFRESH_TOKEN,
            refreshTokenExpireTime: new Date('2023-09-28T14:45:55.144Z'),
          },
          MEMBER,
        )
      })
    })
  })
})
