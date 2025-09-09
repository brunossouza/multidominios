import { Controller, Get, Req } from '@nestjs/common';
import { TenantConfigService } from './tenant-config.service';

@Controller('config')
export class TenantConfigController {
  constructor(private readonly tenantConfigService: TenantConfigService) { }

  @Get()
  getConfig(@Req() req: Request): any {
    // Apesar de HTTP headers serem case-insensitive, alguns ambientes podem alterar o casing dos headers.
    // Esse parece ser o caso aqui com o NestJS.
    const tenant = req.headers['x-tenant'] as string;
    return this.tenantConfigService.getConfig(tenant);
  }
}
