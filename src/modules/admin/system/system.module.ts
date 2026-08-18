import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UserStatusModule } from './user-status/user-status.module';

@Module({
    imports: [
        UserModule,
        UserStatusModule,
    ]
})
export class SystemModule {}
