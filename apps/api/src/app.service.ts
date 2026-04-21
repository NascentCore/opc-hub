import { Injectable } from '@nestjs/common';
import type { ApiResponse } from '@opc/shared';

@Injectable()
export class AppService {
  getHealth(): ApiResponse<string> {
    return {
      code: 0,
      data: 'ok',
      message: 'OPC API is running',
    };
  }
}
