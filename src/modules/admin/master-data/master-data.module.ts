import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { SprintModule } from './sprint/sprint.module';

@Module({
  imports: [ProjectModule, SprintModule],
})
export class MasterDataModule {}
