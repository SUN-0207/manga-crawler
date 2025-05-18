import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { MangaService } from './manga.service';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }

  @Get(':uuid')
  finOne(@Param('uuid', new ParseUUIDPipe()) uuid: string): string {
    return 'kakakkak';
  }
}
