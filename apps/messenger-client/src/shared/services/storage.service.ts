import { api } from '@lib/axios.ts';
import axios from 'axios';
import type { PresignedUrlResponse } from '../types/responses/presigned-url.response.ts';

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
};
