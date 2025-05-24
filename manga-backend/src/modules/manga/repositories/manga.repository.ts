import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMangaDto } from '../dto/create-manga.dto';
import { UpdateMangaDto } from '../dto/update-manga.dto';
import { Manga } from '../schemas/manga.schema';

@Injectable()
export class MangaRepository {
  constructor(
    @InjectModel('manga') private readonly mangaModel: Model<Manga>,
  ) {}

  async create(createMangaDto: CreateMangaDto): Promise<Manga> {
    const newManga = new this.mangaModel(createMangaDto);
    return newManga.save();
  }

  async findAll(): Promise<Manga[]> {
    return this.mangaModel.find().exec();
  }

  async findOne(id: string): Promise<Manga | null> {
    return this.mangaModel.findById(id).exec();
  }

  async update(
    id: string,
    updateMangaDto: UpdateMangaDto,
  ): Promise<Manga | null> {
    return this.mangaModel
      .findByIdAndUpdate(id, updateMangaDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Manga | null> {
    return this.mangaModel.findByIdAndDelete(id).exec();
  }
} 