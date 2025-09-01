import { TenantMiddlewareMiddleware } from './tenant-middleware.middleware';

describe('TenantMiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new TenantMiddlewareMiddleware()).toBeDefined();
  });
});
