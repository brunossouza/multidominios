import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('TenantMiddleware called');

    // Apesar de HTTP headers serem case-insensitive, alguns ambientes podem alterar o casing dos headers.
    // Esse parece ser o caso aqui com o NestJS.
    const domain = req.headers['x-tenant']; // Ex: 'web.tenant1.com'

    if (typeof domain !== 'string') {
      this.logger.warn('X-Tenant header is missing or not a string');
      //TODO: Aplique a lógica padrão ou retorne um erro, conforme necessário.
      next();
      return;
    }

    this.logger.debug(`Extracted domain: ${domain}`);
    if (domain) {
      this.logger.debug(`Setting X-Tenant header to: ${domain}`);
      req.headers['x-tenant'] = domain;
    }

    next();
  }
}
