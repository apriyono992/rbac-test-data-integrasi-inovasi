import { Logger } from '@nestjs/common';

export class BaseService {
  protected readonly logger = new Logger(this.constructor.name);

  protected handleError(error: any, message: string) {
    this.logger.error(message, error.stack);
    throw error;
  }
}