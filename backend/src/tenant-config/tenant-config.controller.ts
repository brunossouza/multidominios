import { Controller, Get, Req } from '@nestjs/common';
import { TenantConfigService } from './tenant-config.service';

@Controller('config')
export class TenantConfigController {
  constructor(private readonly tenantConfigService: TenantConfigService) {}

  @Get()
  getConfig(@Req() req: Request): any {
    const tenant = req.headers['x-tenant'] as string;
    return this.tenantConfigService.getConfig(tenant);
  }
}
