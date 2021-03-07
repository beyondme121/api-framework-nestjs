import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_group_relation' })
export class UserGroupRelationEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '主键id',
  })
  id: number;

  @Column({
    type: 'int',
    name: 'group_id',
    comment: '用户组id',
  })
  groupId: number;

  @Column({
    type: 'int',
    name: 'user_id',
    nullable: false,
    comment: '用户id',
  })
  userId: number;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: () => 0,
    comment: '用户组与用户关联状态: 0: 正常在用, 1: 已删除',
  })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'create_time',
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: Date;
}
