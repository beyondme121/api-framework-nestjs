import { ToolService } from '../../../../utils/tool.service';
import { ObjectType } from 'src/types/object-type';
import { UpdateAccessDTO } from '../dto/update.access.dto';
import { StatusCode } from '@src/config/constants';
import { CreateAccessDTO } from '../dto/create.access.dto';
import { AccessEntity } from '../entities/access.entity';
import { getConnection, Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
    private readonly toolService: ToolService,
  ) {}

  /**
   * desc: 创建资源
   * @param createAccessDto
   */
  async createAccess(createAccessDto: CreateAccessDTO) {
    const { moduleName, actionName } = createAccessDto;
    if (moduleName) {
      const result = await this.accessRepository.find({
        where: { moduleName, isDel: 0 },
      });
      if (result) {
        throw new HttpException(
          `你创建的moduleName:${moduleName},数据库已经存在,不能重名`,
          HttpStatus.OK,
        );
      }
    }
    if (actionName) {
      const result = await this.accessRepository.find({
        where: { actionName, isDel: 0 },
      });
      if (result) {
        throw new HttpException(
          `你创建的actionName:${actionName},数据库已经存在,不能重名`,
          HttpStatus.OK,
        );
      }
    }
    return await this.accessRepository.save(createAccessDto);
  }

  async deleteById(id: number): Promise<any> {
    // 资源如果有子节点不能删除
    const hasChildren = await this.accessRepository.findOne({
      where: { parentId: id },
    });
    if (hasChildren) {
      throw new HttpException('该节点下含有子节点不能直接删除', HttpStatus.OK);
    }
    const {
      raw: { affectedRows },
    } = await this.accessRepository.update({ id }, { isDel: 1 });
    if (affectedRows) {
      return {
        code: StatusCode.SUCCESS,
        msg: '删除成功',
      };
    } else {
      return {
        code: StatusCode.FAILED,
        msg: '删除失败',
      };
    }
  }

  /**
   * 根据id修改资源信息
   * @param id
   * @param data
   */
  async modifyById(id: number, data: UpdateAccessDTO): Promise<any> {
    const {
      raw: { affectedRows },
    } = await this.accessRepository.update({ id }, data);
    if (affectedRows) {
      return {
        code: StatusCode.SUCCESS,
        msg: '更新成功',
      };
    } else {
      return {
        code: StatusCode.FAILED,
        msg: '更新失败',
      };
    }
  }

  /**
   * 根据类型获取全部的模块, status是可用的(不是禁用的), isDel是否删除为未删除的模块
   * @param type
   */
  async moduleList(type: number) {
    return await this.accessRepository.find({
      where: { type, status: 0, isDel: 0 },
    });
  }

  async accessList(queryOptions: ObjectType): Promise<any> {
    const { pageSize, pageNumber, type = 1, id = -1 } = queryOptions;
    this.toolService.checkPaginationPage(pageSize, pageNumber);
    const [data, total] = await getConnection()
      .createQueryBuilder(AccessEntity, 'access')
      .andWhere(
        '(access.type = :type and access.id = :id and access.isDel = 0)',
        { type, id },
      )
      .orderBy({ 'access.sort': 'ASC' })
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getManyAndCount();

    let resultData = [];
    // 判断是否有子节点
    for (let item of data) {
      let isExist = await this.accessRepository.findOne({
        where: { parentId: id },
      });
      if (isExist) {
        resultData.push({ ...item, children: true });
      } else {
        resultData.push({ ...item, children: false });
      }
    }
    return {
      data: resultData,
      total,
      pageNumber,
      pageSize,
    };
  }
}
