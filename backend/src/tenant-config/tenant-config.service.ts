// src/services/tenant-config.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantConfigService {
  private tenantConfigs = {
    'api.tenant1.com': {
      companyName: 'Tenant 1',
      dbName: 'tenant1_db',
      apiUrl: 'https://api.tenant1.com',
      theme: 'dark',
    },
    'api.tenant2.com': {
      companyName: 'Tenant 2',
      dbName: 'tenant2_db',
      apiUrl: 'https://api.tenant2.com',
      theme: 'light',
    },
  };

  getConfig(tenant: string): any {
    return this.tenantConfigs[tenant] || null;
  }
}
