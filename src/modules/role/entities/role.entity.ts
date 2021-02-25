import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'role_id',
    comment: '角色id',
  })
  role_id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    unique: true,
    name: 'role_name',
    comment: '角色名称',
  })
  role_name: string;

  @Column('varchar', {
    nullable: false,
    default: () => 0,
    name: 'is_active',
    comment: '角色是否激活',
  })
  is_active: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'create_at',
    comment: '角色创建时间',
  })
  create_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'update_at',
    comment: '角色更新时间',
  })
  update_at: Date;
}
