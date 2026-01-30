import { Body, Controller, Post } from '@nestjs/common';
import { StorageService } from './storage.service';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import { PresignedUpload } from './responses/presigned-upload.response';

@Controller('uploads')
@Authorization()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presigned')
  async getPresignedUrl(
    @Body() dto: GetPresignedUrlDto,
  ): Promise<PresignedUpload> {
    return this.storageService.getPresignedUrl(dto);
  }
}
