import { ToolService } from '../../../utils/tool.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessEntity } from './entities/access.entity';
import { Module } from '@nestjs/common';
import { AccessController } from './controllers/access.controller';
import { AccessService } from './services/access.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessEntity])],
  controllers: [AccessController],
  providers: [AccessService, ToolService],
})
export class AccessModule {}
