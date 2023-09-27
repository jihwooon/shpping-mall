import { ItemRepository } from '../domain/item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemCreater } from './item.creater'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { InternalServerErrorException } from '@nestjs/common'
import { userMock } from '../../fixture/memberFixture'
import { MemberRepository } from '../../members/domain/member.repository'
import { MemberNotFoundException } from '../../members/application/error/member-not-found.exception'
import { when } from 'jest-when'

describe('ItemCreater class', () => {
  let itemCreater: ItemCreater
  let connection: Connection

  const ItemRepositoryMock = {
    save: jest.fn(),
  }

  const MemberRepositoryMock = {
    findByEmail: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemCreater,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemRepository,
          useValue: ItemRepositoryMock,
        },
        {
          provide: MemberRepository,
          useValue: MemberRepositoryMock,
        },
      ],
    }).compile()

    itemCreater = module.get<ItemCreater>(ItemCreater)
  })

  describe('registerItem method', () => {
    beforeEach(() => {
      when(ItemRepositoryMock.save).calledWith(expect.anything()).mockResolvedValue(itemMock().id)
      when(MemberRepositoryMock.findByEmail).calledWith(userMock().email).mockResolvedValue(itemMock())
    })

    context('상품 정보가 주어지고 저장을 성공하면', () => {
      it('저장된 id 값을 리턴해야 한다', async () => {
        const id = await itemCreater.registerItem(itemMock(), userMock().email)

        expect(id).toEqual(itemMock().id)
      })
    })

    context('상품 정보가 주어지고 저장을 실패하면', () => {
      beforeEach(async () => {
        when(ItemRepositoryMock.save).mockImplementation(() => {
          throw new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다')
        })
      })
      it('InternalServerErrorException를 던져야 한다', async () => {
        expect(itemCreater.registerItem(itemMock(), userMock().email)).rejects.toThrow(
          new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'),
        )
      })
    })

    context('상품 정보가 주어지고 이메일이 올바르지 않으면', () => {
      it('MemberNotFoundException를 던져야 한다', async () => {
        const not_found_email = (userMock().email = 'defg@email.com')

        expect(itemCreater.registerItem(itemMock(), not_found_email)).rejects.toThrow(
          new MemberNotFoundException('회원 정보를 찾을 수 없습니다'),
        )
      })
    })
  })
})
