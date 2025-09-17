import { Controller, Get, Req } from '@nestjs/common';
import { TenantConfigService } from './tenant-config.service';

@Controller('config')
export class TenantConfigController {
  constructor(private readonly tenantConfigService: TenantConfigService) { }

  @Get()
  getConfig(@Req() req: Request): any {
    // O middleware TenantMiddleware verifica e extrai o domínio do header Origin
    // para manter compatibilidade interna do sistema
    const domain = new URL(req.headers['origin'] as string).hostname;
    return this.tenantConfigService.getConfig(domain);
  }
}
