import { Member } from '../../members/domain/member.entity'

export class Delivery {
  id: number

  deliveryName: string

  deliveryFee: number

  member: Member

  createTime: Date

  updateTime: Date

  createBy: string

  modifiedBy: string

  constructor({
    id = 0,
    deliveryName = '',
    deliveryFee = 0,
    member = new Member({}),
    createTime = new Date(),
    updateTime = new Date(),
    createBy = '',
    modifiedBy = '',
  }: {
    id?: number
    deliveryName?: string
    deliveryFee?: number
    member?: Member
    createTime?: Date
    updateTime?: Date
    createBy?: string
    modifiedBy?: string
  }) {
    this.id = id
    this.deliveryName = deliveryName
    this.deliveryFee = deliveryFee
    this.member = member
    this.createTime = createTime
    this.updateTime = updateTime
    this.createBy = createBy
    this.modifiedBy = modifiedBy
  }
}
