import { Test, TestingModule } from '@nestjs/testing';
import { TenantConfigService } from './tenant-config.service';

interface TenantConfig {
  companyName: string;
  dbName: string;
  apiUrl: string;
  theme: string;
}

describe('TenantConfigService', () => {
  let service: TenantConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantConfigService],
    }).compile();

    service = module.get<TenantConfigService>(TenantConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConfig', () => {
    it('should return configuration for tenant1', () => {
      const expectedConfig: TenantConfig = {
        companyName: 'Tenant 1',
        dbName: 'tenant1_db',
        apiUrl: 'https://api.tenant1.com',
        theme: 'dark',
      };

      const result = service.getConfig('web.tenant1.com') as TenantConfig;

      expect(result).toEqual(expectedConfig);
    });

    it('should return configuration for tenant2', () => {
      const expectedConfig: TenantConfig = {
        companyName: 'Tenant 2',
        dbName: 'tenant2_db',
        apiUrl: 'https://api.tenant2.com',
        theme: 'light',
      };

      const result = service.getConfig('web.tenant2.com') as TenantConfig;

      expect(result).toEqual(expectedConfig);
    });

    it('should return null for unknown tenant', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = service.getConfig('unknown-tenant.com');

      expect(result).toBeNull();
    });

    it('should return null when tenant is undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = service.getConfig(undefined as unknown as string);

      expect(result).toBeNull();
    });

    it('should return null when tenant is null', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = service.getConfig(null as unknown as string);

      expect(result).toBeNull();
    });

    it('should return null when tenant is empty string', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = service.getConfig('');

      expect(result).toBeNull();
    });
  });
});
