import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_detail' })
export class UserDetail {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  create_time: Date;

  @Column()
  update_time: Date;

  @OneToOne(
    (type) => UserEntity, // 明细表中创建正向关系
    (user) => user.detail, // 创建反向关系 与主表的关联
    // 'detail',
  )
  @JoinColumn()
  user: UserEntity;
}
