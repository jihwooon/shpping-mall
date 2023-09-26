import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, InternalServerErrorException, NotFoundException, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { ItemCreater } from '../src/items/application/item.creater'
import { ItemReader } from '../src/items/application/item.reader'
import { ItemUpdater } from '../src/items/application/item.updater'
import { itemMock } from '../src/fixture/itemFixture'
import { ItemUpdateController } from '../src/items/web/item-update.controller'
import { ItemDetailController } from '../src/items/web/item-detail.controller'
import { ItemCreateController } from '../src/items/web/item-create.controller'
import { ItemRepository } from '../src/items/domain/item.repository'
import { MYSQL_CONNECTION } from '../src/config/database/constants'
import { Connection } from 'mysql2/promise'
import { CreateItemRequest } from '../src/items/dto/save-item.dto'
import { ItemResponse } from '../src/items/dto/detail-item.dto'
import { UpdateItemRequest } from '../src/items/dto/update-item.dto'
import { MemberRepository } from '../src/members/domain/member.repository'
import { userMock } from '../src/fixture/memberFixture'
import { JwtAuthGuard } from '../src/config/auth/guards/jwt-auth.guard'
import { jwtTokenFixture } from '../src/fixture/jwtTokenFixture'
import { JwtProvider } from '../src/jwt/jwt.provider'

describe('ItemController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let itemCreater: ItemCreater
  let itemReader: ItemReader
  let itemUpdater: ItemUpdater
  let jwtProvider: JwtProvider

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ItemCreateController, ItemDetailController, ItemUpdateController],
      providers: [
        ItemRepository,
        ItemCreater,
        ItemReader,
        ItemUpdater,
        MemberRepository,
        JwtProvider,
        JwtAuthGuard,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    itemCreater = moduleFixture.get<ItemCreater>(ItemCreater)
    itemReader = moduleFixture.get<ItemReader>(ItemReader)
    itemUpdater = moduleFixture.get<ItemUpdater>(ItemUpdater)
    jwtProvider = moduleFixture.get<JwtProvider>(JwtProvider)

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
      itemCreater.registerItem = jest.fn().mockResolvedValue(itemMock().id)
      jwtProvider.validateToken = jest.fn().mockResolvedValue(userMock().email)
    })

    context('Item 객체가 주어지고 저장을 성공하면', () => {
      it('상태코드 201를 응답해야 한다', async () => {
        const itemRequest: CreateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }

        const {
          status,
          body: { id },
        } = await request(app.getHttpServer())
          .post('/items')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)
          .send(itemRequest)

        expect(status).toEqual(201)
        expect(id).toEqual(itemMock().id)
      })
    })

    context('Item 객체가 주어지고 저장을 실패하면', () => {
      beforeEach(() => {
        itemCreater.registerItem = jest
          .fn()
          .mockRejectedValue(new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다'))
      })
      it('상태코드 500를 응답해야 한다', async () => {
        const itemRequest: CreateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }

        const { status, body } = await request(app.getHttpServer())
          .post('/items')
          .send(itemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(500)
        expect(body).toEqual({
          error: 'Internal Server Error',
          message: '예기치 못한 서버 오류가 발생했습니다',
          statusCode: 500,
        })
      })
    })

    context('상풍명을 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const blank_itemName = ''
        const itemRequest: CreateItemRequest = {
          itemName: blank_itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }
        const { status, body } = await request(app.getHttpServer())
          .post('/items')
          .send(itemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

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
        const blank_itemDetail = ''
        const itemRequest: CreateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: blank_itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }
        const { status, body } = await request(app.getHttpServer())
          .post('/items')
          .send(itemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

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
        const blank_price = undefined
        const itemRequest: CreateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: blank_price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }
        const { status, body } = await request(app.getHttpServer())
          .post('/items')
          .send(itemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

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
        const blank_stockNumber = undefined
        const itemRequest: CreateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: blank_stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }
        const { status, body } = await request(app.getHttpServer())
          .post('/items')
          .send(itemRequest)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

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
    const itemResponse: ItemResponse = {
      id: itemMock().id,
      itemName: itemMock().itemName,
      itemDetail: itemMock().itemDetail,
      price: itemMock().price,
      stockNumber: itemMock().stockNumber,
      sellStatus: itemMock().itemSellStatus,
    }
    context('id 요청을 하면', () => {
      beforeEach(() => {
        itemReader.getItem = jest.fn().mockImplementation(() => itemResponse)
      })

      it('상태코드 200을 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).get(`/items/${itemMock().id}`)

        expect(status).toEqual(200)
        expect(body).toEqual(itemResponse)
      })
    })

    context('잘못된 id 요청을 하면', () => {
      const not_found_id = (itemMock().id = 9999)
      beforeEach(() => {
        itemReader.getItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`))
      })
      it('상태코드 404를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer()).get(`/items/${not_found_id}`)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'Not Found',
          message: '9999에 해당하는 상품을 찾을 수 없습니다.',
          statusCode: 404,
        })
      })
    })
  })

  describe('PATCH /items/:id', () => {
    context('id와 변경 된 item 요청을 하면', () => {
      beforeEach(() => {
        itemUpdater.updateItem = jest.fn().mockImplementation(() => true)
      })

      it('상태코드 200을 응답한다', async () => {
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)

        expect(status).toEqual(200)
        expect(body).toEqual({})
      })
    })

    context('잘못된 id와 변경 된 item 요청을 하면', () => {
      const not_found_id = (itemMock().id = 9999)
      beforeEach(() => {
        itemUpdater.updateItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`))
      })

      it('상태코드 404을 응답해야 한다', async () => {
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${not_found_id}`)
          .send(updateItemRequest)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'Not Found',
          message: '9999에 해당하는 상품을 찾을 수 없습니다.',
          statusCode: 404,
        })
      })
    })

    context('상풍명을 누락하면', () => {
      it('상태코드 400를 응답해야 한다', async () => {
        const not_found_itemName = (itemMock().itemName = '')
        const updateItemRequest: UpdateItemRequest = {
          itemName: not_found_itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)

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
        const not_found_itemDetail = (itemMock().itemDetail = '')
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: not_found_itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)

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
        const not_found_price = (itemMock().price = undefined)
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: not_found_price,
          stockNumber: itemMock().stockNumber,
        }

        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)

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
        const not_found_stockName = (itemMock().stockNumber = undefined)
        const updateItemRequest: UpdateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          sellStatus: itemMock().itemSellStatus,
          price: itemMock().price,
          stockNumber: not_found_stockName,
        }
        const { status, body } = await request(app.getHttpServer())
          .patch(`/items/${itemMock().id}`)
          .send(updateItemRequest)

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

  afterAll(async () => {
    await app.close()
  })
})
