import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validationMiddleware = <T extends object>(type: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToClass(type, req.body);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      res.status(400).json({
        error: 'Validation failed',
        details: formattedErrors,
      });
      return;
    }

    req.body = dto;
    next();
  };
};
