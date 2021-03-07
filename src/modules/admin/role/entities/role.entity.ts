import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'role_id',
    comment: '主键id',
  })
  roleId: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    unique: true,
    name: 'role_name',
    comment: '角色名称',
  })
  roleName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    comment: '角色描述',
  })
  roleDesc: string;

  @Column('tinyint', {
    nullable: false,
    default: () => 0,
    name: 'status',
    comment: '角色是否删除 0:在用; 1:已删除',
  })
  status: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'created_by_user_id',
    comment: '角色创建人',
  })
  createdByUserId: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'create_time',
    comment: '角色创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'update_time',
    comment: '角色更新时间',
  })
  updateTime: Date;
}
