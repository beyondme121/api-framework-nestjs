import { Exclude } from 'class-transformer';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('access')
export class AccessEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键id',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
    length: 50,
    name: 'module_name',
    comment: '模块名称',
  })
  moduleName: string | null;

  @Column({
    type: 'tinyint',
    nullable: true,
    name: 'type',
    comment: '节点类型: 顶级模块: 1, 菜单: 2, 操作: 3',
  })
  type: number | null;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
    length: 100,
    name: 'action_name',
    comment: '操作名称',
  })
  actionName: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'icon',
    comment: '小图标',
  })
  icon: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'url',
    comment: 'url地址',
  })
  url: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 10,
    name: 'method',
    comment: '请求方式',
  })
  method: string | null;

  @Column({
    type: 'int',
    nullable: false,
    default: () => -1,
    name: 'parent_id',
    comment: '父模块id',
  })
  parentId: number;

  @Column({
    type: 'int',
    nullable: false,
    default: () => 1,
    name: 'sort',
    comment: '排序',
  })
  sort: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'description',
    comment: '描素',
  })
  description: string | null;

  @Column('tinyint', {
    nullable: true,
    default: () => 1,
    name: 'status',
    comment: '状态,1表示正常,0表示禁用',
  })
  status: number | null;

  @Exclude()
  @Column({
    type: 'tinyint',
    nullable: false,
    default: () => 0,
    name: 'is_del',
    comment: '是否删除,1表示删除,0表示正常',
  })
  isDel: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'created_time',
    comment: '创建时间',
  })
  created_time: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'updated_time',
    comment: '更新时间',
  })
  updated_time: Date;
}