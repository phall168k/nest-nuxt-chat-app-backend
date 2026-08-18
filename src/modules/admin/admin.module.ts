import { Module } from '@nestjs/common';
import { UserModule } from './system/user/user.module';
import { JwtBaseModule } from 'src/common/modules/jwt-base.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    JwtBaseModule,
    UserModule,
    SystemModule,
  ]
})
export class AdminModule {}
