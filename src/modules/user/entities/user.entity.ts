import { Exclude } from 'class-transformer';
import { ObjectType } from 'src/types/object-type';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserDetail } from './user_detail.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    nullable: false,
  })
  username: string;

  @Exclude()
  @Column({
    length: 32,
    nullable: false,
  })
  password: string;

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
    comment: '密码盐',
  })
  salt: string;

  @Column({
    type: 'int',
    default: () => 0,
    comment: '是否被删除 0: 正常在用, 1: 已删除',
  })
  is_del: number;

  @Column()
  create_time: Date;

  @Column()
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
