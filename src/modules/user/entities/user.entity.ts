import { Exclude } from 'class-transformer';
import { ObjectType } from 'src/types/object-type';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserDetail } from './user_detail.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '主键id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'username',
    nullable: false,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    name: 'username_cn',
    comment: '用户中文名',
  })
  userNameCN: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 32,
    nullable: false,
    comment: '密码',
  })
  password: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 32,
    comment: '密码盐',
  })
  salt: string;

  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string;

  @Column({
    length: 100,
    comment: '用户办公地址',
  })
  address: string;

  @Column({
    length: 11,
    comment: '手机号码',
  })
  mobile: string;

  @Column({
    type: 'varchar',
    comment: '用户类别:1.管理员 2. 普通用户',
  })
  type: string;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: () => 0,
    comment: '是否被删除 0: 正常在用, 1: 已删除',
  })
  is_del: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    comment: '创建时间',
  })
  create_time: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    comment: '更新时间',
  })
  update_time: Date;

  @OneToOne((type) => UserDetail, (userDetail) => userDetail.user, {
    // 在关系中设置表示保存相关对象, 比如保存user实体的同时, 保存user明细实体
    cascade: true,
  })
  detail: UserDetail;

  // 定义用户数据返回的内容
  public get toResponseObject(): ObjectType {
    const { password, salt, is_del, ...rest } = this;
    return rest;
  }
}
