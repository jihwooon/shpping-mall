import { ItemRepository } from '../domain/item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemService } from './item.service'
import { ITEMS } from '../../fixture/itemFixture'
import { Item } from '../domain/item.entity'
import { DatabaseModule } from '../../config/database/database.module'
import { DbHelper } from '../../config/helper/db.helper'

describe('ItemService', () => {
  let itemService: ItemService
  let itemRepository: ItemRepository
  let dbHelper: DbHelper
  let items = new Item(ITEMS)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ItemRepository, ItemService, DbHelper],
    }).compile()

    itemService = module.get<ItemService>(ItemService)
    itemRepository = module.get<ItemRepository>(ItemRepository)
    dbHelper = module.get<DbHelper>(DbHelper)
  })

  beforeEach(async () => {
    await dbHelper.clear()
  })

  describe('itemService 메서드', () => {
    context('Item 객체가 주어지면', () => {
      it('메서드 호출을 검증한다 ', async () => {
        const spyFn = jest.spyOn(itemService, 'registerItem').mockImplementation()
        await itemService.registerItem(items)

        expect(spyFn).toHaveBeenCalled()
        expect(spyFn).toBeCalledWith(items)
      })
    })
  })

  describe('findById 메서드', () => {
    const ID = 1
    context('id가 주어지면', () => {
      beforeEach(() => {
        itemRepository.findById = jest.fn().mockImplementation(() => ITEMS)
      })

      it('item 정보를 반환한다', async () => {
        const item = await itemService.getItem(ID)

        expect(item.id).toBe(1)
        expect(item.itemName).toBe('New Balance 530 Steel Grey')
        expect(item.itemDetail).toBe('M990WT6')
        expect(item.stockNumber).toBe(10)
        expect(item.itemSellStatus).toBe('SELL')
        expect(item.createBy).toBe('생성자')
        expect(item.modifiedBy).toBe('수정자')
        expect(item.createTime).toStrictEqual(new Date('2023-09-01T23:10:00.009Z'))
        expect(item.updateTime).toStrictEqual(new Date('2023-09-01T23:10:00.009Z'))
      })
    })
  })
})
