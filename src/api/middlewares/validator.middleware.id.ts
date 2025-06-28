import { Request, Response, NextFunction } from 'express';
import { ValidatorIdService } from '../../core/services/validation/validatorID/validator.id.service.js';
import { BadRequestError } from '../../core/services/Error/validation.error.service.js';

export function validateAllIdParams(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  if (id) {
    try {
      ValidatorIdService.currentValidate(id);
      next();
    } catch {
      next(new BadRequestError("ID inválido ou inexistente"));
    }
  } else {
    next();
  }
}