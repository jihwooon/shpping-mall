import { Connection } from 'mysql2/promise'
import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemUpdater } from './item.updater'
import { ItemRepository } from '../domain/item.repository'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../config/database/constants'
import { when } from 'jest-when'
import { Item } from '../domain/item.entity'
import { ItemStatusEnum } from '../domain/item-status.enum'
import { userMock } from '../../fixture/memberFixture'

describe('ItemUpdater class', () => {
  let itemUpdater: ItemUpdater
  let connection: Connection

  const ItemRepositoryMock = {
    update: jest.fn(),
  }

  const updatedItem = new Item({
    id: 1,
    createTime: new Date('2023-09-01T23:10:00.009Z'),
    updateTime: new Date('2023-09-01T23:10:00.009Z'),
    createBy: '생성자',
    modifiedBy: '수정자',
    itemDetail: 'M990WT6',
    itemName: (itemMock().itemName = 'NIKE'),
    sellStatus: ItemStatusEnum.SELL,
    stockNumber: (itemMock().stockNumber = 2),
    price: (itemMock().price = 999),
    member: userMock(),
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemUpdater,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemRepository,
          useValue: ItemRepositoryMock,
        },
      ],
    }).compile()

    itemUpdater = module.get<ItemUpdater>(ItemUpdater)
  })

  describe('updateItem method', () => {
    beforeEach(() => {
      when(ItemRepositoryMock.update)
        .calledWith(itemMock().id, updatedItem)
        .mockImplementation(() => true)
    })

    context('상품 id와 변경 된 상품이 주어지면', () => {
      it('true를 리턴해야 한다.', async () => {
        const item = await itemUpdater.updateItem(itemMock().id, updatedItem)

        expect(item).toBe(true)
      })
    })

    context('찾을 수 없는 상품 id이 주어지고 변경 된 상품이 주어지면', () => {
      const not_found_id = (itemMock().id = 99999)

      it('NotFoundException을 던져야 한다', async () => {
        expect(itemUpdater.updateItem(not_found_id, updatedItem)).rejects.toThrow(
          new NotFoundException(`${not_found_id}에 해당하는 상품 변경을 실패했습니다.`, {
            cause: new Error(),
            description: 'NOT_FOUND',
          }),
        )
      })
    })

    context('상품 id이 주어지고 상품이 변경 되지 않으면', () => {
      it('NotFoundException을 던져야 한다', async () => {
        expect(itemUpdater.updateItem(itemMock().id, itemMock())).rejects.toThrow(
          new NotFoundException(`${itemMock().id}에 해당하는 상품 변경을 실패했습니다.`, {
            cause: new Error(),
            description: 'NOT_FOUND',
          }),
        )
      })
    })
  })
})
