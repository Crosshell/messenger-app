import { api } from '@lib/axios.ts';
import axios from 'axios';
import type { PresignedUrlResponse } from '../types/responses/presigned-url.response.ts';
import type { Attachment } from '@features/chat/model/types/attachment.type';

export const storageService = {
  async getPresignedUrl(file: File) {
    const response = await api.post<PresignedUrlResponse>(
      '/uploads/presigned',
      {
        filename: file.name,
        contentType: file.type,
        size: file.size,
      },
    );
    return response.data;
  },

  async uploadToS3(uploadUrl: string, file: File) {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      transformRequest: [(data) => data],
    });
  },

  async uploadFiles(files: File[]): Promise<Attachment[]> {
    if (files.length === 0) return [];

    return Promise.all(
      files.map(async (file) => {
        const { uploadUrl, fileUrl } = await this.getPresignedUrl(file);

        await this.uploadToS3(uploadUrl, file);

        return {
          url: fileUrl,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        };
      }),
    );
  },
};
