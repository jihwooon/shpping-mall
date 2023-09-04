import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { ItemModule } from '../src/items/item.module'
import { ItemCreater } from '../src/items/application/item.creater'
import { ItemRepository } from '../src/items/domain/item.repository'
import { DatabaseModule } from '../src/config/database/database.module'
import { ItemReader } from '../src/items/application/item.reader'
import {
  CREATE_NOT_DETAIL_REQUEST,
  CREATE_NOT_NAME_REQUEST,
  CREATE_NOT_PRICE_REQUEST,
  CREATE_NOT_STOCK_REQUEST,
  CREATE_REQUEST,
  CREATE_RESPONSE,
} from '../src/fixture/itemFixture'

describe('ItemController (e2e)', () => {
  let app: INestApplication
  let itemCreater: ItemCreater
  let itemReader: ItemReader

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ItemModule, DatabaseModule],
      providers: [ItemCreater, ItemReader, ItemRepository],
    }).compile()

    itemCreater = moduleFixture.get<ItemCreater>(ItemCreater)
    itemReader = moduleFixture.get<ItemReader>(ItemReader)
    app = moduleFixture.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )

    await app.init()
  })

  describe('POST /items', () => {
    beforeEach(() => {
      itemCreater.registerItem = jest.fn().mockResolvedValue(undefined)
    })

    context('Item 객체가 주어지면', () => {
      it('상태코드 204를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/items').send(CREATE_REQUEST)

        expect(status).toEqual(204)
        expect(body).toEqual({})
      })
    })

    context('상풍명을 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/items').send(CREATE_NOT_NAME_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['상품명은 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })

    context('상품 상세를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/items').send(CREATE_NOT_DETAIL_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['상품 상세는 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })
    context('가격를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/items').send(CREATE_NOT_PRICE_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: ['price must be a number conforming to the specified constraints', '가격은 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })
    context('재고를 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).post('/items').send(CREATE_NOT_STOCK_REQUEST)

        expect(status).toEqual(400)
        expect(body).toEqual({
          error: 'Bad Request',
          message: [
            'stockNumber must be a number conforming to the specified constraints',
            '재고는 필수 입력 값입니다.',
          ],
          statusCode: 400,
        })
      })
    })
  })

  describe('GET /items/:id', () => {
    const ID = 1
    const NOT_FOUND_ID = 9999
    context('id 요청을 하면', () => {
      beforeEach(() => {
        itemReader.getItem = jest.fn().mockImplementation(() => CREATE_RESPONSE)
      })

      it('상태코드 200을 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).get(`/items/${ID}`)

        expect(status).toEqual(200)
        expect(body).toEqual({
          id: 1,
          itemDetail: 'M990WT6',
          itemName: 'New Balance 530 Steel Grey',
          price: 130000,
          sellStatus: 'SELL',
          stockNumber: 10,
        })
      })
    })

    context('잘못된 id 요청을 하면', () => {
      beforeEach(() => {
        itemReader.getItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${NOT_FOUND_ID}에 해당하는 상품을 찾을 수 없습니다.`))
      })
      it('상태코드 404를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).get(`/items/${NOT_FOUND_ID}`)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'Not Found',
          message: '9999에 해당하는 상품을 찾을 수 없습니다.',
          statusCode: 404,
        })
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
