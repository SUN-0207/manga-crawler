import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Permission } from '../../shared/enums/permission.enum';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [String], enum: Object.values(Permission), default: [] })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
