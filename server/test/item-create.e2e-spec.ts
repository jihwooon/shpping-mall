import { Test, TestingModule } from '@nestjs/testing'
import {
  ForbiddenException,
  INestApplication,
  InternalServerErrorException,
  ValidationPipe,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common'
import * as request from 'supertest'
import { ItemCreater } from '../src/items/application/item.creater'
import { ItemReader } from '../src/items/application/item.reader'
import { ItemUpdater } from '../src/items/application/item.updater'
import { itemMock } from '../fixture/itemFixture'
import { ItemUpdateController } from '../src/items/web/item-update.controller'
import { ItemDetailController } from '../src/items/web/item-detail.controller'
import { ItemCreateController } from '../src/items/web/item-create.controller'
import { ItemRepository } from '../src/items/domain/item.repository'
import { MYSQL_CONNECTION } from '../src/database/constants'
import { Connection } from 'mysql2/promise'
import { CreateItemRequest } from '../src/items/dto/save-item.dto'
import { MemberRepository } from '../src/members/domain/member.repository'
import { userMock } from '../fixture/memberFixture'
import { JwtAuthGuard } from '../src/config/auth/guards/jwt-auth.guard'
import { jwtTokenFixture } from '../fixture/jwtTokenFixture'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { RolesGuard } from '../src/config/auth/guards/role-auth.guard'
import { when } from 'jest-when'
import { MemberNotFoundException } from '../src/members/application/error/member-not-found.exception'
import { ItemImageUpdater } from '../src/item-images/application/item-image.updater'
import { ItemImageRepository } from '../src/item-images/domain/item-image.repository'

describe('ItemCreateController (e2e)', () => {
  let app: INestApplication
  let connection: Connection

  const RolesGuardMock: CanActivate = {
    canActivate: jest.fn(() => true),
  }

  const ItemCreaterMock = {
    registerItem: jest.fn(),
  }

  const JwtProviderMock = {
    validateToken: jest.fn(),
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ItemCreateController, ItemDetailController, ItemUpdateController],
      providers: [
        ItemRepository,
        ItemReader,
        ItemUpdater,
        MemberRepository,
        ItemImageUpdater,
        ItemImageRepository,
        JwtProvider,
        JwtAuthGuard,
        RolesGuard,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
        {
          provide: ItemCreater,
          useValue: ItemCreaterMock,
        },
        {
          provide: JwtProvider,
          useValue: JwtProviderMock,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(RolesGuardMock)
      .compile()

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
      when(ItemCreaterMock.registerItem).mockResolvedValue(itemMock().id)
      when(JwtProviderMock.validateToken).mockResolvedValue(userMock().email)
      when(RolesGuardMock.canActivate).mockResolvedValue(true)
    })

    context('상품 정보가 주어지고 저장을 성공하면', () => {
      it('201 Created를 응답해야 한다', async () => {
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

    context('상품 정보가 주어지고 저장을 실패하면', () => {
      beforeEach(() => {
        when(ItemCreaterMock.registerItem).mockImplementation(() => {
          throw new InternalServerErrorException('예기치 못한 서버 오류가 발생했습니다')
        })
      })
      it('500 Internal Server Error를 응답해야 한다', async () => {
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

    context('상품 정보가 주어지고 회원 정보를 찾을 수 없으면', () => {
      beforeEach(() => {
        when(ItemCreaterMock.registerItem).mockImplementation(() => {
          throw new MemberNotFoundException('회원 정보를 찾을 수 없습니다')
        })
      })
      it('404 MemberNotFound를 응답해야 한다', async () => {
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

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'MEMBER_NOT_EXITED',
          message: '회원 정보를 찾을 수 없습니다',
          statusCode: 404,
        })
      })
    })

    context('상품 정보가 주어지고 권한 접근에 실패하면', () => {
      beforeEach(() => {
        when(RolesGuardMock.canActivate).mockImplementation(() => {
          throw new ForbiddenException('접근 할 수 없는 권한입니다')
        })
      })
      it('403 Forbidden를 응답해야 한다', async () => {
        const itemRequest: CreateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }

        const { status, body } = await request(app.getHttpServer())
          .post('/items')
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)
          .send(itemRequest)

        expect(status).toEqual(403)
        expect(body).toEqual({ error: 'Forbidden', message: '접근 할 수 없는 권한입니다', statusCode: 403 })
      })
    })

    context('상품 정보가 주어지고 토큰을 찾을 수 없으면', () => {
      beforeEach(() => {
        when(RolesGuardMock.canActivate).mockImplementation(() => {
          throw new ForbiddenException('접근 할 수 없는 권한입니다')
        })
      })
      it('403 Forbidden를 응답해야 한다', async () => {
        const itemRequest: CreateItemRequest = {
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }

        const { status, body } = await request(app.getHttpServer()).post('/items').send(itemRequest)

        expect(status).toEqual(403)
        expect(body).toEqual({ error: 'Forbidden', message: '요청에서 인증 토큰을 찾을 수 없습니다', statusCode: 403 })
      })
    })

    context('상품 정보가 주어지고 토큰을 인증 할 수 없으면', () => {
      beforeEach(() => {
        when(JwtProviderMock.validateToken)
          .calledWith(jwtTokenFixture().invalidToken)
          .mockImplementation(() => {
            throw new UnauthorizedException('인증 할 수 없는 token 입니다')
          })
      })
      it('401 Unauthorized를 응답해야 한다', async () => {
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
          .set('Authorization', 'Bearer ' + jwtTokenFixture().invalidToken)

        expect(status).toEqual(401)
        expect(body).toEqual({ error: 'Unauthorized', message: '인증 할 수 없는 token 입니다', statusCode: 401 })
      })
    })

    context('상풍명을 누락하면', () => {
      it('400 Bad Request를 응답해야 한다', async () => {
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
      it('400 Bad Request를 응답해야 한다', async () => {
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
      it('400 Bad Request를 응답해야 한다', async () => {
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
          message: ['가격은 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })

    context('재고를 누락하면', () => {
      it('400 Bad Request를 응답해야 한다', async () => {
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
          message: ['재고는 필수 입력 값입니다.'],
          statusCode: 400,
        })
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
