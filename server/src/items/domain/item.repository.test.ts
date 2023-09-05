import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Test, TestingModule } from '@nestjs/testing'
import { DB_RESPONSE, ITEMS } from '../../fixture/itemFixture'
import { ItemRepository } from './item.repository'
import { MYSQL_CONNECTION } from '../../config/database/constants'

describe('ItemRepository class', () => {
  let connection: Connection
  let itemRepository: ItemRepository
  const ID = 1
  const NOT_FOUND_ID = 9999

  connection = {
    execute: jest.fn(),
  } as unknown as Connection

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    itemRepository = module.get<ItemRepository>(ItemRepository)
  })

  describe('save method', () => {
    context('item 객체가 주어지면', () => {
      it('메서드 호출을 검즘해야 한다.', async () => {
        const spyOn = jest.spyOn(itemRepository, 'save').mockResolvedValue()
        await itemRepository.save(ITEMS)

        expect(spyOn).toHaveBeenCalled()
        expect(spyOn).toHaveBeenCalledWith(ITEMS)
      })
    })
  })

  describe('findById method', () => {
    context('id가 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[DB_RESPONSE] as RowDataPacket[], []])
      })
      it('item 객체를 리턴해야 한다', async () => {
        const items = await itemRepository.findById(ID)

        expect(items).toEqual({
          id: 1,
          itemName: 'New Balance 530 Steel Grey',
          itemDetail: 'M990WT6',
          price: 130000,
          itemSellStatus: 'SELL',
          stockNumber: 5,
          createTime: new Date('2023-09-03T22:31:02.000Z'),
          updateTime: null,
          createBy: null,
          modifiedBy: null,
        })
      })
    })

    context('잘못된 id가 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([[undefined] as RowDataPacket[], []])
      })
      it('undefined를 리턴해야 한다', async () => {
        const item = await itemRepository.findById(NOT_FOUND_ID)

        expect(item).toEqual(undefined)
      })
    })
  })

  describe('update method', () => {
    context('id와 수정 할 item 객체가 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }] as ResultSetHeader[])
      })
      it('true를 리턴해야 한다', async () => {
        const items = await itemRepository.update(ID, ITEMS)

        expect(items).toEqual(true)
      })
    })
    context('잘못된 id와 수정 할 item 객체가 주어지면', () => {
      beforeEach(async () => {
        connection.execute = jest.fn().mockResolvedValue([{ affectedRows: 0 }] as ResultSetHeader[])
      })
      it('false를 리턴해야 한다', async () => {
        const items = await itemRepository.update(ID, ITEMS)

        expect(items).toEqual(false)
      })
    })
  })
})
