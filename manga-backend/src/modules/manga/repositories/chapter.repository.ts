import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter, ChapterDocument } from '../schemas/chapter.schema';

@Injectable()
export class ChapterRepository {
  constructor(
    @InjectModel('chapter') private readonly chapterModel: Model<Chapter>,
  ) {}

  async create(chapterData: Partial<Chapter>): Promise<ChapterDocument> {
    const newChapter = new this.chapterModel(chapterData);
    return newChapter.save();
  }

  async createMany(chaptersData: Partial<Chapter>[]): Promise<ChapterDocument[]> {
    const result = await this.chapterModel.insertMany(chaptersData);
    return result as ChapterDocument[];
  }

  async findByMangaId(mangaId: string): Promise<ChapterDocument[]> {
    return this.chapterModel.find({ mangaId }).exec();
  }

  async findOne(id: string): Promise<ChapterDocument | null> {
    return this.chapterModel.findById(id).exec();
  }

  async update(id: string, chapterData: Partial<Chapter>): Promise<ChapterDocument | null> {
    const result = await this.chapterModel
      .findByIdAndUpdate(id, chapterData, { new: true })
      .exec();
    return result as ChapterDocument | null;
  }

  async remove(id: string): Promise<ChapterDocument | null> {
    return this.chapterModel.findByIdAndDelete(id).exec();
  }
} 