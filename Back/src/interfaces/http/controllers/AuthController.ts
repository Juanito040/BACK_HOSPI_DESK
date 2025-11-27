import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { LoginUseCase, CreateUserUseCase } from '../../../application/use-cases';
import { RequestPasswordResetUseCase } from '../../../application/use-cases/RequestPasswordResetUseCase';
import { ResetPasswordUseCase } from '../../../application/use-cases/ResetPasswordUseCase';
import { ITokenService } from '../../../application/ports/ITokenService';

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
      const tokenService = container.resolve<ITokenService>('ITokenService');

      const user = await useCase.execute(req.body);

      const payload = {
        userId: user.id,
        email: user.email.getValue(),
        role: user.role,
      };

      const token = tokenService.generateAccessToken(payload);
      const refreshToken = tokenService.generateRefreshToken(payload);

      res.status(201).json({
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email.getValue(),
          role: user.role,
        },
      });
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
