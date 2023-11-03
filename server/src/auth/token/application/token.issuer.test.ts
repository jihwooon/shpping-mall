import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mysql2/promise'
import { TokenIssuer } from './token.issuer'
import { MemberRepository } from '../../../members/domain/member.repository'
import { MYSQL_CONNECTION } from '../../../database/constants'
import { MemberNotFoundException } from '../../../members/application/error/member-not-found.exception'
import { userMock } from '../../../../fixture/memberFixture'
import { JwtProvider } from '../../../jwt/jwt.provider'
import { TokenExpiredException } from '../error/token_expired.exception'
import { InternalServerErrorException } from '@nestjs/common'
import { jwtTokenFixture } from '../../../../fixture/jwtTokenFixture'

describe('TokenIssuer class', () => {
  let connect: Connection
  let tokenIssuer: TokenIssuer
  let memberRepository: MemberRepository
  let jwtProvider: JwtProvider

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenIssuer,
        MemberRepository,
        JwtProvider,
        {
          provide: MYSQL_CONNECTION,
          useValue: connect,
        },
      ],
    }).compile()

    tokenIssuer = module.get<TokenIssuer>(TokenIssuer)
    memberRepository = module.get<MemberRepository>(MemberRepository)
    jwtProvider = module.get<JwtProvider>(JwtProvider)
  })

  describe('createAccessTokenByRefreshToken method', () => {
    beforeEach(() => {
      memberRepository.findMemberByRefreshToken = jest.fn().mockResolvedValue(userMock())
      jwtProvider.validateToken = jest.fn().mockResolvedValue(userMock().email)
    })
    context('refreshToken이 주어지면', () => {
      it('accessToken과 accessTokenExpireTime을 갱신해야 한다', async () => {
        const member = await tokenIssuer.createAccessTokenByRefreshToken(
          jwtTokenFixture().refreshToken,
          jwtTokenFixture().now,
        )

        expect(member).not.toEqual({
          accessToken: jwtTokenFixture().accessToken,
          accessTokenExpireTime: jwtTokenFixture().now,
        })
      })
    })

    context('refreshToken이 찾을 수 없거나 올바르지 않으면', () => {
      beforeEach(() => {
        memberRepository.findMemberByRefreshToken = jest.fn().mockResolvedValue(undefined)
      })
      it('MemberNotFoundException를 던져야 한다', async () => {
        expect(
          tokenIssuer.createAccessTokenByRefreshToken(jwtTokenFixture().refreshToken, jwtTokenFixture().now),
        ).rejects.toThrow(new MemberNotFoundException('회원 정보를 찾을 수 없습니다'))
      })
    })

    context('refreshToken의 유효기간이 만료 되면', () => {
      it('TokenExpiredException를 던져야 한다', async () => {
        expect(
          tokenIssuer.createAccessTokenByRefreshToken(jwtTokenFixture().refreshToken, jwtTokenFixture().tokenExpired),
        ).rejects.toThrow(new TokenExpiredException('Refresh Token의 유효기간이 만료되었습니다'))
      })
    })
  })

  describe('updateRefreshTokenAndExpirationTime method', () => {
    context('token과 회원 정보가 주어지고 변경이 성공하면', () => {
      beforeEach(() => {
        memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(true)
      })
      it('true를 리턴해야 한다', async () => {
        const updatedToken = await tokenIssuer.updateRefreshTokenAndExpirationTime(
          jwtTokenFixture().refreshToken,
          userMock(),
        )

        expect(updatedToken).toEqual(true)
      })
    })

    context('token과 회원 정보가 주어지고 변경이 실패하면', () => {
      beforeEach(() => {
        memberRepository.updateMemberByRefreshTokenAndExpirationTime = jest.fn().mockResolvedValue(false)
      })
      it('InternalServerErrorException를 던져야 한다', async () => {
        expect(
          tokenIssuer.updateRefreshTokenAndExpirationTime(jwtTokenFixture().refreshToken, userMock()),
        ).rejects.toThrow(new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'))
      })
    })
  })
})
