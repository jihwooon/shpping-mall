import { Test, TestingModule } from '@nestjs/testing'
import { PasswordProvider } from './password.provider'
import { BadRequestException } from '@nestjs/common'

describe('PasswordProvider class', () => {
  let passwordProvider: PasswordProvider

  let RAW_PASSWORD = '1234567'
  let HASHED_PASSWORD = '$2b$10$nEU5CvDwcTwsMfZeiRv6UeYxh.Zp796RXh170vrRVPP.w0en8696K'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordProvider],
    }).compile()

    passwordProvider = module.get<PasswordProvider>(PasswordProvider)
  })

  describe('hash method', () => {
    context('패스워드를 입력하면', () => {
      it('암호화 된 패스워드를 리턴 해야 한다', async () => {
        const hashedPassword = await passwordProvider.hashPassword(RAW_PASSWORD)

        expect(hashedPassword).not.toEqual(HASHED_PASSWORD)
      })
    })

    context('패스워드가 null이면', () => {
      it('BadRequestException를 던져야 한다', async () => {
        try {
          await passwordProvider.hashPassword(null)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toBe('password는 null이 될 수 없습니다')
        }
      })
    })

    context('패스워드가 undefined이면', () => {
      it('BadRequestException를 던져야 한다', async () => {
        try {
          await passwordProvider.hashPassword(undefined)
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException)
          expect(e.message).toBe('password는 undefined이 될 수 없습니다')
        }
      })
    })
  })
})
