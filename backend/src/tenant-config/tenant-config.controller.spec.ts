import { Test, TestingModule } from '@nestjs/testing';
import { TenantConfigController } from './tenant-config.controller';
import { TenantConfigService } from './tenant-config.service';

describe('TenantConfigController', () => {
  let controller: TenantConfigController;

  const mockTenantConfigService = {
    getConfig: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantConfigController],
      providers: [
        {
          provide: TenantConfigService,
          useValue: mockTenantConfigService,
        },
      ],
    }).compile();

    controller = module.get<TenantConfigController>(TenantConfigController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConfig', () => {
    it('should return tenant config when valid tenant header is provided', () => {
      const mockConfig = {
        companyName: 'Tenant 1',
        dbName: 'tenant1_db',
        apiUrl: 'https://api.tenant1.com',
        theme: 'dark',
      };
      const mockRequest = {
        headers: {
          'x-tenant': 'web.tenant1.com',
        },
      } as unknown as Request;

      mockTenantConfigService.getConfig.mockReturnValue(mockConfig);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = controller.getConfig(mockRequest);

      expect(mockTenantConfigService.getConfig).toHaveBeenCalledWith(
        'web.tenant1.com',
      );
      expect(result).toEqual(mockConfig);
    });

    it('should handle request when x-tenant header is missing', () => {
      const mockRequest = {
        headers: {},
      } as unknown as Request;

      mockTenantConfigService.getConfig.mockReturnValue(null);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = controller.getConfig(mockRequest);

      expect(mockTenantConfigService.getConfig).toHaveBeenCalledWith(undefined);
      expect(result).toBeNull();
    });

    it('should handle request with invalid tenant', () => {
      const mockRequest = {
        headers: {
          'x-tenant': 'invalid-tenant',
        },
      } as unknown as Request;

      mockTenantConfigService.getConfig.mockReturnValue(null);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = controller.getConfig(mockRequest);

      expect(mockTenantConfigService.getConfig).toHaveBeenCalledWith(
        'invalid-tenant',
      );
      expect(result).toBeNull();
    });
  });
});
