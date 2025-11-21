import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodError, ZodTypeAny } from 'zod';
import { BadRequestError } from '../errors/http-error';

type AsyncHandlerWithSchema<TSchema extends ZodTypeAny> = (
  req: Request,
  res: Response,
  next: NextFunction,
  dto: z.infer<TSchema>
) => Promise<void>;

type AsyncHandlerWithoutSchema = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function asyncHandler<TSchema extends ZodTypeAny>(
  handler: AsyncHandlerWithSchema<TSchema>,
  schema: TSchema
): RequestHandler;

export function asyncHandler(handler: AsyncHandlerWithoutSchema): RequestHandler;

export function asyncHandler<TSchema extends ZodTypeAny>(
  handler: AsyncHandlerWithSchema<TSchema> | AsyncHandlerWithoutSchema,
  schema?: TSchema
): RequestHandler {
  return async (req, res, next) => {
    try {
      if (schema) {
        const dto = schema.parse({
          params: req.params,
          query: req.query,
          body: req.body,
        });
        await (handler as AsyncHandlerWithSchema<TSchema>)(req, res, next, dto);
      } else {
        await (handler as AsyncHandlerWithoutSchema)(req, res, next);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new BadRequestError(
            'Validation error',
            error.issues.map((issue) => ({
              path: issue.path.join('.'),
              message: issue.message,
            }))
          )
        );
      }

      next(error);
    }
  };
}
