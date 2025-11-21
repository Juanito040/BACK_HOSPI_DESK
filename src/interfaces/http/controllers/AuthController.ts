import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { LoginUseCase, CreateUserUseCase } from '../../../application/use-cases';
import { RequestPasswordResetUseCase } from '../../../application/use-cases/RequestPasswordResetUseCase';
import { ResetPasswordUseCase } from '../../../application/use-cases/ResetPasswordUseCase';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(LoginUseCase);
      const result = await useCase.execute(req.body);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(CreateUserUseCase);
      const user = await useCase.execute(req.body);

      res.status(201).json(user.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(RequestPasswordResetUseCase);
      const result = await useCase.execute(req.body.email);

      res.json({
        success: true,
        message: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(ResetPasswordUseCase);
      const { token, newPassword } = req.body;

      await useCase.execute(token, newPassword);

      res.json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      next(error);
    }
  }
}
