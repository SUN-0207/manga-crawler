import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema({ timestamps: true })
export class Chapter {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Manga' })
  mangaId: string;

  @Prop()
  chapterNumber: number;

  @Prop()
  title: string;

  @Prop({ type: [String], default: [] })
  pages: string[];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter); 