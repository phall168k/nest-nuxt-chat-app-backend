import { Module } from '@nestjs/common';
import { UserModule } from './system/user/user.module';
import { JwtBaseModule } from 'src/common/modules/jwt-base.module';
import { SystemModule } from './system/system.module';
import { MasterDataModule } from './master-data/master-data.module';

@Module({
  imports: [
    JwtBaseModule,
    UserModule,
    SystemModule,
    MasterDataModule,
  ]
})
export class AdminModule {}
