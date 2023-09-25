import { ItemRepository } from '../domain/item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemCreater } from './item.creater'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'
import { InternalServerErrorException } from '@nestjs/common'

describe('ItemCreater class', () => {
  let itemCreater: ItemCreater
  let itemRepository: ItemRepository
  let connection: Connection

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemRepository,
        ItemCreater,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    itemCreater = module.get<ItemCreater>(ItemCreater)
    itemRepository = module.get<ItemRepository>(ItemRepository)
  })

  describe('registerItem method', () => {
    context('Item 객체가 주어지고 저장을 성공하면', () => {
      beforeEach(async () => {
        itemRepository.save = jest.fn().mockResolvedValue(itemMock().id)
      })
      it('저장된 id 값을 리턴해야 한다', async () => {
        const id = await itemCreater.registerItem(itemMock())

        expect(id).toEqual(itemMock().id)
      })
    })

    context('Item 객체가 주어지고 저장을 실패하면', () => {
      beforeEach(async () => {
        itemRepository.save = jest
          .fn()
          .mockRejectedValue(new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'))
      })
      it('InternalServerErrorException르 던져야 한다', async () => {
        expect(itemCreater.registerItem(itemMock())).rejects.toThrow(
          new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'),
        )
      })
    })
  })
})
