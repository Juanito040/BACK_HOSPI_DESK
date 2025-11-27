import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import { GetUserUseCase } from '../../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsersUseCase';
import { DeleteUserUseCase } from '../../../application/use-cases/DeleteUserUseCase';
import { CreateUserDTO } from '../../../application/dtos/CreateUserDTO';
import { UpdateUserDTO } from '../../../application/dtos/UpdateUserDTO';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserRole } from '../../../domain/entities/User';

@injectable()
export class UserController {
  constructor(
    @inject(CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
    @inject(UpdateUserUseCase) private updateUserUseCase: UpdateUserUseCase,
    @inject(GetUserUseCase) private getUserUseCase: GetUserUseCase,
    @inject(ListUsersUseCase) private listUsersUseCase: ListUsersUseCase,
    @inject(DeleteUserUseCase) private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateUserDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const user = await this.createUserUseCase.execute(dto);
      res.status(201).json(user.toJSON());
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        res.status(409).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(UpdateUserDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const user = await this.updateUserUseCase.execute(req.params.id, dto);
      res.json(user.toJSON());
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error.message === 'Email already in use by another user') {
        res.status(409).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.getUserUseCase.execute(req.params.id);
      res.json(user.toJSON());
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: any = {};

      if (req.query.role) {
        filters.role = req.query.role as UserRole;
      }

      if (req.query.areaId) {
        filters.areaId = req.query.areaId as string;
      }

      if (req.query.activeOnly === 'true') {
        filters.activeOnly = true;
      }

      const users = await this.listUsersUseCase.execute(filters);
      res.json(users.map((u) => u.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteUserUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  }
}
