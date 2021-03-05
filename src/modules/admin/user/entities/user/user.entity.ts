import { Exclude } from 'class-transformer';
import { ObjectType } from 'src/types/object-type';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  userName: string;

  @Column({
    length: 50,
    name: 'chinese_name',
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
    type: 'tinyint',
    nullable: false,
    default: () => 0,
    comment: '状态: 0: 正常在用, 1: 已删除',
  })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'update_time',
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'create_time',
    nullable: false,
    comment: '更新时间',
  })
  updateTime: Date;

  // 定义用户数据返回的内容
  public get toResponseObject(): ObjectType {
    const { password, salt, status, ...rest } = this;
    return rest;
  }
}
