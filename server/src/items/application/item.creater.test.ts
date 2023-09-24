import { ItemRepository } from '../domain/item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemCreater } from './item.creater'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { Connection } from 'mysql2/promise'

describe('ItemCreater class', () => {
  let itemCreater: ItemCreater
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
  })

  describe('registerItem method', () => {
    context('Item 객체가 주어지면', () => {
      it('메서드 호출을 검증해야 한다 ', async () => {
        const spyFn = jest.spyOn(itemCreater, 'registerItem').mockImplementation()
        await itemCreater.registerItem(itemMock())

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(itemMock())
      })
    })
  })
})
