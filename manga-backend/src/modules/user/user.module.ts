import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { RoleSchema } from './role.schema';
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
