import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../../middleware/async-handler.middleware';

describe('asyncHandler middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockRequest = {
      params: {},
      query: {},
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('with schema validation', () => {
    const testSchema = z.object({
      query: z.object({
        id: z.string(),
      }),
    });

    test('passes validated DTO to handler when data is valid', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      mockRequest.query = { id: '123' };

      const middleware = asyncHandler(handler, testSchema);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(handler).toHaveBeenCalledWith(
        mockRequest,
        mockResponse,
        mockNext,
        expect.objectContaining({ query: { id: '123' } })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('throws correct validation error when data is invalid', async () => {
      const handler = jest.fn();
      mockRequest.query = { id: 123 as any }; // Invalid: should be string

      const middleware = asyncHandler(handler, testSchema);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(handler).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 400,
          message: 'Validation error',
          details: expect.arrayContaining([
            expect.objectContaining({
              path: 'query.id',
              message: expect.any(String),
            }),
          ]),
        })
      );
    });

    test('handles validation error with multiple issues', async () => {
      const complexSchema = z.object({
        query: z.object({
          name: z.string(),
          age: z.string(),
        }),
      });
      const handler = jest.fn();
      mockRequest.query = {}; // Missing both required fields

      const middleware = asyncHandler(handler, complexSchema);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 400,
          message: 'Validation error',
          details: expect.arrayContaining([
            expect.objectContaining({ path: 'query.name', message: expect.any(String) }),
            expect.objectContaining({ path: 'query.age', message: expect.any(String) }),
          ]),
        })
      );
    });
  });

  describe('without schema validation', () => {
    test('calls handler without DTO parameter when no schema provided', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);

      const middleware = asyncHandler(handler);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(handler).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('handles successful async execution', async () => {
      const handler = jest.fn(async (req, res) => {
        res.json({ success: true });
      });

      const middleware = asyncHandler(handler);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(handler).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    test('handles errors thrown in synchronous handler', async () => {
      const syncError = new Error('Sync error');
      const handler = jest.fn(() => {
        throw syncError;
      });

      const middleware = asyncHandler(handler);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(syncError);
    });

    test('handles errors thrown in acynhronous handler', async () => {
      const asyncError = new Error('Async error');
      const handler = jest.fn(async (req, res) => {
        throw asyncError
      });

      const middleware = asyncHandler(handler);
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(asyncError);
    });
  });
});
