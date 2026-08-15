import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { JwtBaseModule } from 'src/common/modules/jwt-base.module';
import { UserStatusModule } from './user-status/user-status.module';

@Module({
  imports: [
    JwtBaseModule,
    UserModule,
    UserStatusModule, 
  ]
})
export class AdminModule {}
