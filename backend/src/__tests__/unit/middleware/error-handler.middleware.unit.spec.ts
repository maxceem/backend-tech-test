import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../middleware/error-handler.middleware';
import { BadRequestError, InternalServerError } from '../../../errors/http-error';
import { logger } from '../../../utils/logger';

jest.mock('../../../utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('errorHandler middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  test('handles HttpError by returning the error as-is', () => {
    const validationDetails = [
      { path: 'email', message: 'Invalid email' },
      { path: 'password', message: 'Too short' },
    ];
    const httpError = new BadRequestError('Validation failed', validationDetails);

    errorHandler(
      httpError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: validationDetails,
    });
    // Client errors 4xx should not be logged
    expect(logger.error).not.toHaveBeenCalled();
  });

  test('converts regular Error to InternalServerError', () => {
    const regularError = new Error('Something went wrong');

    errorHandler(
      regularError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Internal server error',
      details: undefined,
    });
    // Logger has to log 5xx errors as they are
    expect(logger.error).toHaveBeenCalledWith('Request handling failed', regularError);
  });

  test('converts non-Error value to InternalServerError', () => {
    const stringError = 'Something bad happened';

    errorHandler(
      stringError as any,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Internal server error',
      details: undefined,
    });
    // Logger has to log 5xx errors as they are
    expect(logger.error).toHaveBeenCalledWith(
      'Request handling failed',
      expect.objectContaining({
        message: 'Something bad happened',
      })
    );
  });
});
