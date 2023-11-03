import { Connection, RowDataPacket } from 'mysql2/promise'
import { Inject } from '@nestjs/common'
import { MYSQL_CONNECTION } from '../../database/constants'
import { Member } from '../../members/domain/member.entity'
import { Delivery } from './delivery.entity'

export class DeliveryRepository {
  constructor(
    @Inject(MYSQL_CONNECTION)
    private connection: Connection,
  ) {}

  async findByMember(member: Member): Promise<Delivery[]> {
    const [[row]] = await this.connection.execute<RowDataPacket[]>(
      'SELECT delivery_id, delivery_name, delivery_fee, member_id, create_time, update_time, create_by, modified_by FROM delivery WHERE member_id = ?',
      [member.memberId],
    )

    return (row ?? []).map((row) => ({
      id: row['delivery_id'],
      deliveryName: row['delivery_name'],
      deliveryFee: row['delivery_fee'],
      member: row['member_id'],
      createTime: row['create_time'],
      updateTime: row['update_time'],
      createBy: row['create_by'],
      modifiedBy: row['modified_by'],
    }))
  }
}
