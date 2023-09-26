import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, NotFoundException, ForbiddenException } from '@nestjs/common'
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
import { MemberRepository } from '../src/members/domain/member.repository'
import { userMock } from '../src/fixture/memberFixture'
import { JwtAuthGuard } from '../src/config/auth/guards/jwt-auth.guard'
import { jwtTokenFixture } from '../src/fixture/jwtTokenFixture'
import { JwtProvider } from '../src/jwt/jwt.provider'
import { RolesGuard } from '../src/config/auth/guards/role-auth.guard'

describe('ItemDetailController (e2e)', () => {
  let app: INestApplication
  let connection: Connection
  let itemReader: ItemReader
  let jwtProvider: JwtProvider
  let rolesGuard: RolesGuard

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ItemCreateController, ItemDetailController, ItemUpdateController],
      providers: [
        ItemRepository,
        ItemReader,
        ItemCreater,
        ItemUpdater,
        MemberRepository,
        JwtProvider,
        JwtAuthGuard,
        RolesGuard,
        {
          provide: MYSQL_CONNECTION,
          useValue: connection,
        },
      ],
    }).compile()

    itemReader = moduleFixture.get<ItemReader>(ItemReader)
    rolesGuard = moduleFixture.get<RolesGuard>(RolesGuard)
    jwtProvider = moduleFixture.get<JwtProvider>(JwtProvider)

    app = moduleFixture.createNestApplication()

    await app.init()
  })

  describe('GET /items/:id', () => {
    beforeEach(() => {
      itemReader.getItem = jest.fn().mockImplementation(() => itemMock())
      jwtProvider.validateToken = jest.fn().mockResolvedValue(userMock().email)
      rolesGuard.canActivate = jest.fn().mockResolvedValue(true)
    })
    context('회원 id가 주어지고 요청을 성공하면', () => {
      it('상태코드 200을 응답해야 한다', async () => {
        const itemResponse = {
          id: itemMock().id + '',
          itemName: itemMock().itemName,
          itemDetail: itemMock().itemDetail,
          price: itemMock().price,
          stockNumber: itemMock().stockNumber,
          sellStatus: itemMock().itemSellStatus,
        }
        const { status, body } = await request(app.getHttpServer())
          .get(`/items/${itemMock().id}`)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(200)
        expect(body).toEqual(itemResponse)
      })
    })

    context('회원 id가 주어지고 요청을 실패하면', () => {
      const not_found_id = (itemMock().id = 9999)
      beforeEach(() => {
        itemReader.getItem = jest
          .fn()
          .mockRejectedValue(new NotFoundException(`${not_found_id}에 해당하는 상품을 찾을 수 없습니다.`))
      })
      it('상태코드 404를 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`/items/${not_found_id}`)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(404)
        expect(body).toEqual({
          error: 'Not Found',
          message: '9999에 해당하는 상품을 찾을 수 없습니다.',
          statusCode: 404,
        })
      })
    })

    context('회원 id가 주어지고 권한 접근을 실패하면', () => {
      beforeEach(() => {
        rolesGuard.canActivate = jest.fn().mockRejectedValue(new ForbiddenException('접근 할 수 없는 권한입니다'))
      })
      it('상태코드 403을 응답해야 한다', async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`/items/${itemMock().id}`)
          .set('Authorization', 'Bearer ' + jwtTokenFixture().accessToken)

        expect(status).toEqual(403)
        expect(body).toEqual({ error: 'Forbidden', message: '접근 할 수 없는 권한입니다', statusCode: 403 })
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
