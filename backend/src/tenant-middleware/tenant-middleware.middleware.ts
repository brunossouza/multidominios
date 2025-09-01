import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('TenantMiddleware called');
    const host = req.headers['host']; // Ex: 'tenant1.example.com'

    if (typeof host !== 'string') {
      this.logger.warn('Host header is missing or not a string');
      next();
      return;
    }

    const domain = host.split(':')[0]; // Extract 'tenant1' from 'tenant1.example.com'

    this.logger.debug(`Extracted domain: ${domain}`);
    if (domain) {
      this.logger.debug(`Setting x-tenant header to: ${domain}`);
      req.headers['x-tenant'] = domain;
    }

    next();
  }
}
