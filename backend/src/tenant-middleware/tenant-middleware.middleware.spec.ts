import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantMiddleware } from './tenant-middleware.middleware';

describe('TenantMiddleware', () => {
  let middleware: TenantMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new TenantMiddleware();
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    mockNext = jest.fn();

    // Mock do Logger
    loggerSpy = jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should call next() when x-tenant header is present and valid', () => {
      mockRequest.headers = {
        'x-tenant': 'web.tenant1.com',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRequest.headers['x-tenant']).toBe('web.tenant1.com');
    });

    it('should log debug messages when processing valid tenant', () => {
      mockRequest.headers = {
        'x-tenant': 'web.tenant2.com',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(loggerSpy).toHaveBeenCalledWith('TenantMiddleware called');
      expect(loggerSpy).toHaveBeenCalledWith(
        'Extracted domain: web.tenant2.com',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Setting X-Tenant header to: web.tenant2.com',
      );
    });

    it('should handle missing x-tenant header', () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');
      mockRequest.headers = {};

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        'X-Tenant header is missing or not a string',
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should handle x-tenant header with non-string value', () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');
      mockRequest.headers = {
        'x-tenant': 123 as unknown as string,
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        'X-Tenant header is missing or not a string',
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should handle x-tenant header with array value', () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');
      mockRequest.headers = {
        'x-tenant': ['web.tenant1.com', 'web.tenant2.com'] as unknown as string,
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        'X-Tenant header is missing or not a string',
      );
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should handle empty string x-tenant header', () => {
      mockRequest.headers = {
        'x-tenant': '',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(loggerSpy).toHaveBeenCalledWith('TenantMiddleware called');
      expect(loggerSpy).toHaveBeenCalledWith('Extracted domain: ');
      expect(mockNext).toHaveBeenCalledTimes(1);
      // Com string vazia, não deve logar "Setting X-Tenant header"
      expect(loggerSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Setting X-Tenant header'),
      );
    });

    it('should preserve other headers while processing x-tenant', () => {
      mockRequest.headers = {
        'x-tenant': 'web.tenant1.com',
        authorization: 'Bearer token123',
        'content-type': 'application/json',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRequest.headers['x-tenant']).toBe('web.tenant1.com');
      expect(mockRequest.headers.authorization).toBe('Bearer token123');
      expect(mockRequest.headers['content-type']).toBe('application/json');
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
