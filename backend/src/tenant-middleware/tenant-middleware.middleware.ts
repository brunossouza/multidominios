import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('TenantMiddleware called');

    // Print all headers for debugging
    this.logger.debug(`Request Headers: ${JSON.stringify(req.headers)}`);

    // Extrai o domínio do header Origin que é enviado automaticamente pelo navegador
    const originHeader = req.headers['origin']; // Ex: 'https://web.tenant1.com'

    if (typeof originHeader !== 'string') {
      this.logger.warn('Origin header is missing or not a string');
      //TODO: Aplique a lógica padrão ou retorne um erro, conforme necessário.
      res.status(400).send('Origin header is required');
      return;
    }

    // Extrai apenas o hostname do URL completo do origin
    let domain: string;
    try {
      const url = new URL(originHeader);
      domain = url.hostname; // Ex: 'web.tenant1.com'
      this.logger.debug(`Extracted domain from Origin: ${domain}`);
    } catch (error) {
      this.logger.error(`Invalid Origin header format: ${originHeader}`, error);
      res.status(400).send('Invalid Origin header format');
      return;
    }

    next();
  }
}
