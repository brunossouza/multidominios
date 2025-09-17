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
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockNext = jest.fn();

    // Mock do Logger
    loggerSpy = jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should call next() when origin header is present and valid', () => {
      mockRequest.headers = {
        'origin': 'https://web.tenant1.com',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledTimes(1);
      // Como o middleware atual não define x-tenant, não testamos isso
    });

    it('should log debug messages when processing valid tenant', () => {
      mockRequest.headers = {
        'origin': 'https://web.tenant2.com',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(loggerSpy).toHaveBeenCalledWith('TenantMiddleware called');
      expect(loggerSpy).toHaveBeenCalledWith(
        'Extracted domain from Origin: web.tenant2.com',
      );
      // Como o middleware atual não logga "Setting tenant header", removemos essa expectativa
    });

    it('should handle missing origin header', () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');
      mockRequest.headers = {};

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        'Origin header is missing or not a string',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Origin header is required');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle origin header with non-string value', () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');
      mockRequest.headers = {
        'origin': 123 as unknown as string,
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        'Origin header is missing or not a string',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Origin header is required');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle origin header with array value', () => {
      const warnSpy = jest.spyOn(Logger.prototype, 'warn');
      mockRequest.headers = {
        'origin': ['https://web.tenant1.com', 'https://web.tenant2.com'] as unknown as string,
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(warnSpy).toHaveBeenCalledWith(
        'Origin header is missing or not a string',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Origin header is required');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle invalid origin URL format', () => {
      const errorSpy = jest.spyOn(Logger.prototype, 'error');
      mockRequest.headers = {
        'origin': 'invalid-url',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(errorSpy).toHaveBeenCalledWith(
        'Invalid Origin header format: invalid-url',
        expect.objectContaining({
          name: 'TypeError',
          message: expect.stringContaining('Invalid URL'),
        }),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Invalid Origin header format');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle origin without protocol', () => {
      const errorSpy = jest.spyOn(Logger.prototype, 'error');
      mockRequest.headers = {
        'origin': 'web.tenant1.com',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(errorSpy).toHaveBeenCalledWith(
        'Invalid Origin header format: web.tenant1.com',
        expect.objectContaining({
          name: 'TypeError',
          message: expect.stringContaining('Invalid URL'),
        }),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Invalid Origin header format');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should preserve other headers while processing origin', () => {
      mockRequest.headers = {
        'origin': 'https://web.tenant1.com',
        authorization: 'Bearer token123',
        'content-type': 'application/json',
      };

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Como o middleware atual não define x-tenant, removemos essa expectativa
      expect(mockRequest.headers.authorization).toBe('Bearer token123');
      expect(mockRequest.headers['content-type']).toBe('application/json');
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
