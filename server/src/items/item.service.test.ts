import { ItemRepository } from './item.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemService } from './item.service'
import { ITEMS } from '../fixture/itemFixture'
import { Item } from './item.entity'
import { DatabaseModule } from '../config/database/database.module'

describe('ItemService', () => {
  let itemService: ItemService
  let itemRepository: ItemRepository
  let items = new Item(ITEMS)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ItemRepository, ItemService],
    }).compile()

    itemService = module.get<ItemService>(ItemService)
    itemRepository = module.get<ItemRepository>(ItemRepository)
  })

  it('registerItem 함수을 호출한다 ', async () => {
    const spyFn = jest.spyOn(itemService, 'registerItem')
    await itemService.registerItem(items)

    expect(spyFn).toHaveBeenCalled()
    expect(spyFn).toBeCalledWith(items)
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
