import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { MangaService } from './manga.service';
import { Request } from 'express';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga..dto';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  // Create a new manga
  @Post()
  create(@Body() createMangaDto: CreateMangaDto, @Req() request: Request) {
    const userId = '1';
    // const userId = request.user['id']; // Assuming JWT user info is stored in request.user
    return this.mangaService.create(createMangaDto, userId);
  }

  // Get all mangas
  @Get()
  findAll() {
    return this.mangaService.findAll();
  }

  // Get a single manga by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mangaService.findOne(id);
  }

  // Update a manga by ID
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMangaDto: UpdateMangaDto,
    @Req() request: Request,
  ) {
    const userId = '1';
    // const userId = request.user['id']; // Get the user ID from the request
    return this.mangaService.update(id, updateMangaDto, userId);
  }

  // Delete a manga by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mangaService.remove(id);
  }
}
