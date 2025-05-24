import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { MangaStatus } from 'src/modules/shared/enums/manga-status.enum';

export class UpdateMangaDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsArray()
  @IsOptional()
  genres?: string[];

  @IsString()
  @IsOptional()
  coverImageURL?: string;

  @IsEnum(MangaStatus)
  @IsOptional()
  status?: MangaStatus;
}
