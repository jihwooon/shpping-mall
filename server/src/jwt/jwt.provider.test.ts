import { Test, TestingModule } from '@nestjs/testing'
import { JwtProvider } from './jwt.provider'

describe('JwtProvider class', () => {
  let jwtProvider: JwtProvider

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
  })
})
