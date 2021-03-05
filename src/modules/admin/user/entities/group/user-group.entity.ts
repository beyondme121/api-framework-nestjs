import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_group' })
export class UserGroupEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '主键id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'user_group_name',
    nullable: false,
    comment: '用户组名称',
  })
  userGroupName: string;

  @Column({
    length: 50,
    name: 'user_group_name_en',
    comment: '用户组英文名称',
  })
  userGroupNameEN: string;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: () => 0,
    comment: '用户组状态: 0: 正常在用, 1: 已删除',
  })
  status: number;

  @Column({
    type: 'tinyint',
    nullable: false,
    name: 'parent_id',
    default: () => 1,
    comment: '父级用户组id',
  })
  parentId: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_time',
    nullable: false,
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
