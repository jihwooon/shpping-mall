import { Connection } from 'mysql2/promise'
import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemUpdater } from './item.updater'
import { ItemRepository } from '../domain/item.repository'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../config/database/constants'

describe('ItemUpdater class', () => {
  let itemUpdater: ItemUpdater
  let itemRepository: ItemRepository
  let connection: Connection

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemUpdater,
        ItemRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    itemUpdater = module.get<ItemUpdater>(ItemUpdater)
    itemRepository = module.get<ItemRepository>(ItemRepository)
  })

  describe('updateItem method', () => {
    const not_found_id = (itemMock().id = 99999)
    context('id와 변경 된 item 객체가 주어지면', () => {
      beforeEach(() => {
        itemRepository.update = jest.fn().mockImplementation(() => true)
      })

      it('true를 리턴해야 한다.', async () => {
        const item = await itemUpdater.updateItem(itemMock().id, itemMock())

        expect(item).toBe(true)
      })
    })

    context('잘못 된 id와 변경 된 item 객체가 주어지면', () => {
      beforeEach(() => {
        itemRepository.update = jest.fn().mockImplementation(() => undefined)
      })

      it('NotFoundException을 던져야 한다', async () => {
        expect(itemUpdater.updateItem(not_found_id, itemMock())).rejects.toThrow(
          new NotFoundException(`${not_found_id}에 해당하는 상품 변경을 실패했습니다.`, {
            cause: new Error(),
            description: 'NOT_FOUND',
          }),
        )
      })
    })
  })
})
