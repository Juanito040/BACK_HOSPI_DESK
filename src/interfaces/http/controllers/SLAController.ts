import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { CreateSLAUseCase } from '../../../application/use-cases/CreateSLAUseCase';
import { UpdateSLAUseCase } from '../../../application/use-cases/UpdateSLAUseCase';
import { GetSLAUseCase } from '../../../application/use-cases/GetSLAUseCase';
import { ListSLAsUseCase } from '../../../application/use-cases/ListSLAsUseCase';
import { DeleteSLAUseCase } from '../../../application/use-cases/DeleteSLAUseCase';
import { CreateSLADTO } from '../../../application/dtos/CreateSLADTO';
import { UpdateSLADTO } from '../../../application/dtos/UpdateSLADTO';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@injectable()
export class SLAController {
  constructor(
    @inject(CreateSLAUseCase) private createSLAUseCase: CreateSLAUseCase,
    @inject(UpdateSLAUseCase) private updateSLAUseCase: UpdateSLAUseCase,
    @inject(GetSLAUseCase) private getSLAUseCase: GetSLAUseCase,
    @inject(ListSLAsUseCase) private listSLAsUseCase: ListSLAsUseCase,
    @inject(DeleteSLAUseCase) private deleteSLAUseCase: DeleteSLAUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateSLADTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const sla = await this.createSLAUseCase.execute(dto);
      res.status(201).json(sla.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(UpdateSLADTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const sla = await this.updateSLAUseCase.execute(req.params.id, dto);
      res.json(sla.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sla = await this.getSLAUseCase.execute(req.params.id);
      res.json(sla.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const areaId = req.query.areaId as string | undefined;
      const slas = await this.listSLAsUseCase.execute(areaId);
      res.json(slas.map((s) => s.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteSLAUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
