import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../config/database/constants'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { SignoutService } from './signout.service'
import { TokenExpiredException } from '../../token/error/token_expired.exception'
import { TokenType } from '../../../jwt/token-type.enum'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'
import { NotAccessTokenTypeException } from '../../token/error/not-access-token-type.exception'
import { InternalServerErrorException } from '@nestjs/common'
import { TokenIssuer } from '../../token/application/token.issuer'
import { userMock } from '../../../fixture/memberFixture'
import { jwtTokenFixture } from '../../../fixture/jwtTokenFixture'

describe('Signout class', () => {
  let connect: Connection
  let memberRepository: MemberRepository
  let signoutService: SignoutService
  let jwtProvider: JwtProvider

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberRepository,
        SignoutService,
        JwtProvider,
        TokenIssuer,
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
      ],
    }).compile()

    signoutService = module.get<SignoutService>(SignoutService)
    memberRepository = module.get<MemberRepository>(MemberRepository)
    jwtProvider = module.get<JwtProvider>(JwtProvider)
  })

  describe('logout method', () => {
    beforeEach(async () => {
      jwtProvider.validateToken = jest.fn().mockResolvedValue({
        payload: userMock().email,
        expirationTime: jwtTokenFixture().accessTokenExpire,
        subject: jwtTokenFixture().tokenType,
        audience: userMock().email,
      })
      memberRepository.findByEmail = jest.fn().mockResolvedValue({
        email: userMock().email,
      })
      memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(true)
    })
    context('accessToken이 주어지면', () => {
      it('true를 리턴해야 한다', async () => {
        const generateAccessToken = jwtProvider.generateAccessToken(userMock().email)

        const memberId = await signoutService.logout(generateAccessToken.accessToken)

        expect(memberId).toEqual(true)
      })
    })

    context('accessToken 유효기간이 만료되면', () => {
      beforeEach(() => {
        jwtProvider.validateToken = jest.fn().mockResolvedValue({
          payload: userMock().email,
          expirationTime: (jwtTokenFixture().accessTokenExpire = new Date(0)),
          subject: jwtTokenFixture().tokenType,
          audience: userMock().email,
        })
      })
      it('TokenExpiredException을 던져야 한다', () => {
        const generateAccessToken = jwtProvider.generateAccessToken(userMock().email)

        expect(signoutService.logout(generateAccessToken.accessToken)).rejects.toThrow(
          new TokenExpiredException('AccessToken 유효기간이 만료되었습니다'),
        )
      })
    })

    context('accessToken 타입이 아니면', () => {
      beforeEach(() => {
        jwtProvider.validateToken = jest.fn().mockResolvedValue({
          payload: userMock().email,
          expirationTime: jwtTokenFixture().accessTokenExpire,
          subject: (jwtTokenFixture().tokenType = TokenType.REFRESH),
          audience: userMock().email,
        })
      })
      it('NotAccessTokenTypeException을 던져야 한다', () => {
        const generateAccessToken = jwtProvider.generateAccessToken(userMock().email)

        expect(signoutService.logout(generateAccessToken.accessToken)).rejects.toThrow(
          new NotAccessTokenTypeException('AccessToken Type이 아닙니다'),
        )
      })
    })

    context('회원 정보가 올바르지 않으면', () => {
      beforeEach(() => {
        memberRepository.findByEmail = jest.fn().mockResolvedValue(undefined)
      })
      it('MemberNotFoundException을 던져야 한다', () => {
        const generateAccessToken = jwtProvider.generateAccessToken(userMock().email)

        expect(signoutService.logout(generateAccessToken.accessToken)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })

    context('가입 된 회원 정보가 주어지고 token과 만료 기한 변경이 실패하면', () => {
      beforeEach(() => {
        memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(false)
      })
      it('InternalServerErrorException을 던져야 한다', () => {
        const generateAccessToken = jwtProvider.generateAccessToken(userMock().email)

        expect(signoutService.logout(generateAccessToken.accessToken)).rejects.toThrow(
          new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'),
        )
      })
    })
  })
})
