import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MangaStatus } from '../../shared/enums/manga-status.enum';

export type MangaDocument = HydratedDocument<Manga>;

@Schema({ timestamps: true })
export class Manga {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  author?: string;

  @Prop({ type: [String], default: [] })
  genres: string[];

  @Prop({ required: false })
  coverImageURL?: string;

  @Prop({
    type: String,
    enum: Object.values(MangaStatus),
    default: MangaStatus.ONGOING,
    required: true,
  })
  status: MangaStatus;
}

export const MangaSchema = SchemaFactory.createForClass(Manga); 