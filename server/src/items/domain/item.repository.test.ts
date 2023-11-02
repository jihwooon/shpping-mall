import { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { Test, TestingModule } from '@nestjs/testing'
import { dbItemMock, detailItemMock, itemMock } from '../../fixture/itemFixture'
import { ItemRepository } from './item.repository'
import { MYSQL_CONNECTION } from '../../database/constants'

describe('ItemRepository class', () => {
  let itemRepository: ItemRepository

  const ItemRepositoryMock = {
    execute: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemRepository,
        {
          provide: MYSQL_CONNECTION,
          useValue: ItemRepositoryMock,
        },
      ],
    }).compile()

    itemRepository = module.get<ItemRepository>(ItemRepository)
  })

  describe('save method', () => {
    context('item 정보가 저장에 성공하면', () => {
      beforeEach(() => {
        ItemRepositoryMock.execute.mockResolvedValue([{ insertId: 1 }] as ResultSetHeader[])
      })
      it('생성 된 insertId를 리턴해야 한다', async () => {
        const insertId = await itemRepository.save(itemMock())

        expect(insertId).toEqual(1)
      })
    })

    context('item 정보가 저장에 실패하면', () => {
      beforeEach(() => {
        ItemRepositoryMock.execute.mockResolvedValue([{ insertId: 0 }] as ResultSetHeader[])
      })
      it('undefined를 리턴해야 한다', async () => {
        const insertId = await itemRepository.save(itemMock())

        expect(insertId).toEqual(undefined)
      })
    })
  })

  describe('findById method', () => {
    context('id가 주어지면', () => {
      beforeEach(async () => {
        ItemRepositoryMock.execute.mockResolvedValue([[dbItemMock] as RowDataPacket[], []])
      })
      it('item 객체를 리턴해야 한다', async () => {
        const items = await itemRepository.findById(itemMock().id)

        expect(items).toEqual(detailItemMock)
      })
    })

    context('잘못된 id가 주어지면', () => {
      beforeEach(async () => {
        ItemRepositoryMock.execute.mockResolvedValue([[undefined] as RowDataPacket[], []])
      })
      it('undefined를 리턴해야 한다', async () => {
        const not_found_id = (itemMock().id = 9999)
        const item = await itemRepository.findById(not_found_id)

        expect(item).toEqual(undefined)
      })
    })
  })

  describe('update method', () => {
    context('id와 수정 할 item 객체가 주어지면', () => {
      beforeEach(async () => {
        ItemRepositoryMock.execute.mockResolvedValue([{ affectedRows: 1 }] as ResultSetHeader[])
      })
      it('true를 리턴해야 한다', async () => {
        const items = await itemRepository.update(itemMock().id, itemMock())

        expect(items).toEqual(true)
      })
    })

    context('잘못된 id와 수정 할 item 객체가 주어지면', () => {
      beforeEach(async () => {
        ItemRepositoryMock.execute.mockResolvedValue([{ affectedRows: 0 }] as ResultSetHeader[])
      })
      it('false를 리턴해야 한다', async () => {
        const items = await itemRepository.update(itemMock().id, itemMock())

        expect(items).toEqual(false)
      })
    })
  })
})
