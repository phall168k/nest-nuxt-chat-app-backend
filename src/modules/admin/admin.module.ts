import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { JwtBaseModule } from 'src/common/modules/jwt-base.module';

@Module({
  imports: [
    JwtBaseModule,
    UserModule, 
  ]
})
export class AdminModule {}
