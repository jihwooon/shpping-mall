import { Connection } from 'mysql2/promise'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemUpdater } from './item.updater'
import { ItemRepository } from '../domain/item.repository'
import { itemMock } from '../../fixture/itemFixture'
import { MYSQL_CONNECTION } from '../../database/constants'
import { when } from 'jest-when'
import { Item } from '../domain/item.entity'
import { ItemStatusEnum } from '../domain/item-status.enum'
import { userMock } from '../../fixture/memberFixture'
import { ItemNotFoundException } from '../error/item-not-found.exception'
import { ItemUpdatedFailException } from '../error/item-updated-fail.exception'
import { MemberRepository } from '../../members/domain/member.repository'
import { filesMock, itemImageListMock, itemImageMock } from '../../fixture/itemImageFixture'
import { ItemImageUpdater } from '../../item-images/application/item-image.updater'
import { ItemImageRepository } from '../../item-images/domain/item-image.repository'

describe('ItemUpdater class', () => {
  let itemUpdater: ItemUpdater
  let connection: Connection

  const ItemRepositoryMock = {
    update: jest.fn(),
    findById: jest.fn(),
  }

  const MemberRepositoryMock = {
    findByEmail: jest.fn(),
  }

  const ItemImageRepositoryMock = {
    findByItemOrderByItemImageIdAsc: jest.fn(),
    update: jest.fn(),
  }

  const updatedItem = new Item({
    id: itemMock().id,
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
        ItemImageUpdater,
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
        {
          provide: ItemImageRepository,
          useValue: ItemImageRepositoryMock,
        },
      ],
    }).compile()

    itemUpdater = module.get<ItemUpdater>(ItemUpdater)
  })

  describe('updateItem method', () => {
    beforeEach(() => {
      when(ItemRepositoryMock.findById).calledWith(itemMock().id).mockReturnValue(itemMock())
      when(MemberRepositoryMock.findByEmail).calledWith(userMock().email).mockResolvedValue(userMock().memberId)
      when(ItemRepositoryMock.update)
        .calledWith(itemMock().id, expect.anything())
        .mockImplementation(() => true)
      when(ItemImageRepositoryMock.findByItemOrderByItemImageIdAsc)
        .calledWith(itemMock().id)
        .mockResolvedValue(itemImageListMock())
      when(ItemImageRepositoryMock.update)
        .calledWith(itemImageMock().id, itemImageMock())
        .mockImplementation(() => true)
    })

    context('상품 id와 변경 된 상품이 주어지면', () => {
      it('true를 리턴해야 한다.', async () => {
        const item = await itemUpdater.updateItem(userMock().email, itemMock().id, updatedItem, filesMock())

        expect(item).toBe(true)
      })
    })

    context('찾을 수 없는 상품 id이 주어지고 변경 된 상품이 주어지면', () => {
      const not_found_id = (itemMock().id = 99999)
      beforeEach(() => {
        when(ItemRepositoryMock.findById)
          .calledWith(not_found_id)
          .mockImplementation(() => {
            throw new ItemNotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`)
          })
      })

      it('NotFoundException을 던져야 한다', async () => {
        expect(itemUpdater.updateItem(userMock().email, not_found_id, updatedItem, filesMock())).rejects.toThrow(
          new ItemNotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`),
        )
      })
    })

    context('상품 id이 주어지고 상품이 변경을 실패하면', () => {
      beforeEach(() => {
        when(ItemRepositoryMock.update)
          .calledWith(itemMock().id, expect.anything())
          .mockImplementation(() => false)
      })
      it('ItemUpdatedFailException을 던져야 한다', async () => {
        expect(itemUpdater.updateItem(userMock().email, itemMock().id, itemMock(), filesMock())).rejects.toThrow(
          new ItemUpdatedFailException(`해당 상품 변경에 실패했습니다`),
        )
      })
    })
  })
})
