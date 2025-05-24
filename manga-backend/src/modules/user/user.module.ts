import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserSchema } from './schemas/user.schema';
import { RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: UserSchema },
      { name: 'role', schema: RoleSchema },
    ]),
  ],
  providers: [UserService],
})
export class UserModule {}
