// 给用户添加角色
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键id',
  })
  id: number;

  @Column({
    nullable: false,
    name: 'user_id',
    comment: '用户id',
  })
  userId: number;

  @Column({
    nullable: false,
    name: 'role_id',
    comment: '角色id',
  })
  roleId: number;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: () => 0,
    comment: '状态 0: 正常在用, 1: 已删除',
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
