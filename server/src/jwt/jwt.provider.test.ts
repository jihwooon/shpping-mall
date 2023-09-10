import { Test, TestingModule } from '@nestjs/testing'
import { JwtProvider } from './jwt.provider'
import * as jwt from 'jsonwebtoken'
import { BadRequestException, UnauthorizedException } from '@nestjs/common'

describe('JwtProvider class', () => {
  let jwtProvider: JwtProvider

  let ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1lbWJlcklkIjoxLCJlbWFpbCI6ImFiY0BlbWFpbC5jb20iLCJtZW1iZXJOYW1lIjoi7ZmN6ri464-ZIiwibWVtYmVyVHlwZSI6IkdFTkVSQUwiLCJwYXNzd29yZCI6IjEyMzQ1Njc4IiwicmVmcmVzaFRva2VuIjoiZXlKaGJHY2lPaUpJIiwidG9rZW5FeHBpcmF0aW9uVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInVwZGF0ZVRpbWUiOiIyMDIzLTA5LTAxVDIzOjEwOjAwLjAwOVoiLCJjcmVhdGVCeSI6Iu2Zjeq4uOuPmSIsIm1vZGlmaWVkQnkiOiLquYDssqDsiJgifSwiaWF0IjoxNjk0MzEzOTIyLCJleHAiOjE2OTQ0MDAzMjJ9.F5gN5mkLFk6nET2pJ78_sTdb_YIStT7u8ei7rfK1I7c'

  let INVALID_ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1lbWJlcklkIjoxLCJlbWFpbCI6ImFiY0BlbWFpbC5jb20iLCJtZW1iZXJOYW1lIjoi7ZmN6ri464-ZIiwibWVtYmVyVHlwZSI6IkdFTkVSQUwiLCJwYXNzd29yZCI6IjEyMzQ1Njc4IiwicmVmcmVzaFRva2VuIjoiZXlKaGJHY2lPaUpJIiwidG9rZW5FeHBpcmF0aW9uVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInVwZGF0ZVRpbWUiOiIyMDIzLTA5LTAxVDIzOjEwOjAwLjAwOVoiLCJjcmVhdGVCeSI6Iu2Zjeq4uOuPmSIsIm1vZGlmaWVkQnkiOiLquYDssqDsiJgifSwiaWF0IjoxNjk0MzEzOTIyLCJleHAiOjE2OTQ0MDAzMjJ9.F5gN5mkLFk6nET2pJ78_sTdb_YIStT7u8ei7rfK1I123'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtProvider],
    }).compile()

    jwtProvider = module.get<JwtProvider>(JwtProvider)
  })

  describe('generateAccessToken method', () => {
    context('사용자 정보가 주어 질 때', () => {
      const Id = 1
      it('accessToken을 리턴 해야 한다', () => {
        const accessToken = jwtProvider.generateAccessToken(Id)

        expect(accessToken).not.toEqual(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im1lbWJlcklkIjoxLCJlbWFpbCI6ImFiY0BlbWFpbC5jb20iLCJtZW1iZXJOYW1lIjoi7ZmN6ri464-ZIiwibWVtYmVyVHlwZSI6IkdFTkVSQUwiLCJwYXNzd29yZCI6IjEyMzQ1Njc4IiwicmVmcmVzaFRva2VuIjoiZXlKaGJHY2lPaUpJIiwidG9rZW5FeHBpcmF0aW9uVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInJvbGUiOiJVU0VSIiwiY3JlYXRlVGltZSI6IjIwMjMtMDktMDFUMjM6MTA6MDAuMDA5WiIsInVwZGF0ZVRpbWUiOiIyMDIzLTA5LTAxVDIzOjEwOjAwLjAwOVoiLCJjcmVhdGVCeSI6Iu2Zjeq4uOuPmSIsIm1vZGlmaWVkQnkiOiLquYDssqDsiJgifSwiaWF0IjoxNjk0MzEzOTIyLCJleHAiOjE2OTQ0MDAzMjJ9.F5gN5mkLFk6nET2pJ78_sTdb_YIStT7u8ei7rfK1I7c',
        )
      })
    })

    context('accessToken이 검증을 성공하면', () => {
      it('id를 리턴 해야 한다.', () => {
        const decoded = jwtProvider.validateToken(ACCESS_TOKEN)

        expect(decoded).toEqual(1)
      })
    })
    context('accessToken이 검증을 실패하면', () => {
      it('JsonWebTokenError을 던져야 한다', () => {
        try {
          jwtProvider.validateToken(INVALID_ACCESS_TOKEN)
        } catch (e) {
          expect(e).toBeInstanceOf(UnauthorizedException)
          expect(e.message).toEqual('인증 할 수 없는 token 입니다')
        }
      })
    })
    context('accessToken이 null 이면', () => {
      it('BadRequestException을 던져야 한다', () => {
        try {
          jwtProvider.validateToken(null)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('token는 null이 될 수 없습니다')
        }
      })
    })
    context('accessToken이 undefined 이면', () => {
      it('BadRequestException을 던져야 한다', () => {
        try {
          jwtProvider.validateToken(undefined)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('token는 undefined이 될 수 없습니다')
        }
      })
    })
    context('accessToken이 공백 이면', () => {
      it('BadRequestException을 던져야 한다', () => {
        try {
          jwtProvider.validateToken('')
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toEqual('token는 이 될 수 없습니다')
        }
      })
    })
  })
})
