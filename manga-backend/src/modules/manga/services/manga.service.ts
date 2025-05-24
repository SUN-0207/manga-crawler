import { Injectable } from '@nestjs/common';
import { CreateMangaDto } from '../dto/create-manga.dto';
import { UpdateMangaDto } from '../dto/update-manga.dto';
import { Manga } from '../schemas/manga.schema';
import { MangaRepository } from '../repositories/manga.repository';

@Injectable()
export class MangaService {
  constructor(private readonly mangaRepository: MangaRepository) {}

  async create(createMangaDto: CreateMangaDto): Promise<Manga> {
    return this.mangaRepository.create(createMangaDto);
  }

  async findAll(): Promise<Manga[]> {
    return this.mangaRepository.findAll();
  }

  async findOne(id: string): Promise<Manga | null> {
    return this.mangaRepository.findOne(id);
  }

  async update(
    id: string,
    updateMangaDto: UpdateMangaDto,
  ): Promise<Manga | null> {
    return this.mangaRepository.update(id, updateMangaDto);
  }

  async remove(id: string): Promise<Manga | null> {
    return this.mangaRepository.remove(id);
  }
} 