import { Module } from '@nestjs/common';
import { UserStatusGateway } from './user-status.gateway';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        UserModule,
    ],
    providers: [
        UserStatusGateway
    ],
})
export class UserStatusModule {}
