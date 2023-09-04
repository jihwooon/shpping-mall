import { ItemRepository } from '../domain/item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemCreater } from './item.creater'
import { ITEMS } from '../../fixture/itemFixture'
import { Item } from '../domain/item.entity'
import { DatabaseModule } from '../../config/database/database.module'
import { DbHelper } from '../../config/helper/db.helper'

describe('ItemCreater class', () => {
  let itemCreater: ItemCreater
  let itemRepository: ItemRepository
  let dbHelper: DbHelper
  let items = new Item(ITEMS)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ItemRepository, ItemCreater, DbHelper],
    }).compile()

    itemCreater = module.get<ItemCreater>(ItemCreater)
    itemRepository = module.get<ItemRepository>(ItemRepository)
    dbHelper = module.get<DbHelper>(DbHelper)
  })

  beforeEach(async () => {
    await dbHelper.clear()
  })

  describe('registerItem method', () => {
    context('Item 객체가 주어지면', () => {
      it('메서드 호출을 검증해야 한다 ', async () => {
        const spyFn = jest.spyOn(itemCreater, 'registerItem').mockImplementation()
        await itemCreater.registerItem(items)

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(items)
      })
    })
  })
})
