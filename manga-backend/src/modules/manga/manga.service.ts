import { Injectable } from '@nestjs/common';
import { MangaRepository } from './manga.repository';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga..dto';
import { Manga } from './manga.schema';

@Injectable()
export class MangaService {
  constructor(private readonly mangaRepository: MangaRepository) {}

  // Create a new manga
  async create(createMangaDto: CreateMangaDto, userId: string): Promise<Manga> {
    // Set createdBy and updatedBy to the user who created it
    //createMangaDto['createdBy'] = userId;
    //createMangaDto['updatedBy'] = userId;
    return this.mangaRepository.create(createMangaDto);
  }

  // Get all mangas
  async findAll(): Promise<Manga[]> {
    return this.mangaRepository.findAll();
  }

  // Get a single manga by ID
  async findOne(id: string): Promise<Manga | null> {
    return this.mangaRepository.findOne(id);
  }

  // Update a manga by ID
  async update(
    id: string,
    updateMangaDto: UpdateMangaDto,
    userId: string,
  ): Promise<Manga | null> {
    // Set the updatedBy field
    //updateMangaDto['updatedBy'] = userId;
    return this.mangaRepository.update(id, updateMangaDto);
  }

  // Delete a manga by ID
  async remove(id: string): Promise<Manga | null> {
    return this.mangaRepository.remove(id);
  }
}
