import { Body, Controller, Post } from '@nestjs/common';
import { StorageService } from './storage.service';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';

@Controller('uploads')
@Authorization()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presigned')
  async getPresignedUrl(@Body() dto: GetPresignedUrlDto) {
    return this.storageService.getPresignedUrl(
      dto.filename,
      dto.contentType,
      dto.size,
    );
  }
}
