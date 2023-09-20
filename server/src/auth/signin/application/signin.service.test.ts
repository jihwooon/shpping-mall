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
import { userMock } from '../../../fixture/memberFixture'
import { jwtTokenFixture } from '../../../fixture/jwtTokenFixture'

describe('Signup class', () => {
  let connect: Connection
  let memberRepository: MemberRepository
  let signinService: SigninService
  let passwordProvider: PasswordProvider

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
      memberRepository.findByEmail = jest.fn().mockResolvedValue(userMock())
      passwordProvider.comparePassword = jest.fn().mockResolvedValue(true)
      memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(true)
    })
    context('가입된 회원 정보를 확인하면', () => {
      it('인증을 성공하고, accessToken과 refreshToken을 리턴 해야 한다', async () => {
        const authentication = await signinService.login(userMock().email, userMock().password)

        expect(authentication).not.toEqual({
          accessToken: jwtTokenFixture().accessToken,
          refreshToken: jwtTokenFixture().refreshToken,
        })
      })
      it('인증을 성공하고, accessTokenExpire과 refreshTokenExpire을 리턴 해야 한다', async () => {
        const { accessTokenExpireTime, refreshTokenExpireTime } = await signinService.login(
          userMock().email,
          userMock().password,
        )

        expect(accessTokenExpireTime).toBeTruthy()
        expect(refreshTokenExpireTime).toBeTruthy()
      })
    })

    context('찾을 수 없는 이메일이 undefined이면', () => {
      beforeEach(() => {
        memberRepository.findByEmail = jest.fn().mockResolvedValue(undefined)
      })
      it('MemberNotFoundException을 던져야 한다', async () => {
        const not_found_email = 'notfound@email.com'

        expect(signinService.login((userMock().email = not_found_email), userMock().password)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })

    context('찾을 수 없는 이메일이 null이면', () => {
      beforeEach(() => {
        memberRepository.findByEmail = jest.fn().mockResolvedValue(null)
      })
      it('MemberNotFoundException을 던져야 한다', async () => {
        const not_found_email = 'notfound@email.com'

        expect(signinService.login((userMock().email = not_found_email), userMock().password)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })

    context('찾을 수 없는 패스워드가 주어지면', () => {
      beforeEach(() => {
        passwordProvider.comparePassword = jest.fn().mockResolvedValue(false)
      })
      it('BadRequestException을 던져야 한다', async () => {
        const not_found_password = 'not_found_password'
        expect(signinService.login(userMock().email, (userMock().password = not_found_password))).rejects.toThrow(
          new BadRequestException('패스워드가 일치 하지 않습니다'),
        )
      })
    })

    context('가입 된 회원 정보가 주어지고 token과 만료 기한 변경이 실패하면', () => {
      beforeEach(() => {
        memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(false)
      })
      it('InternalServerErrorException을 던져야 한다', async () => {
        expect(signinService.login(userMock().email, userMock().password)).rejects.toThrow(
          new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'),
        )
      })
    })
  })
})
