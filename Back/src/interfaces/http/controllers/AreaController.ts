import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { CreateAreaUseCase } from '../../../application/use-cases/CreateAreaUseCase';
import { UpdateAreaUseCase } from '../../../application/use-cases/UpdateAreaUseCase';
import { GetAreaUseCase } from '../../../application/use-cases/GetAreaUseCase';
import { ListAreasUseCase } from '../../../application/use-cases/ListAreasUseCase';
import { DeleteAreaUseCase } from '../../../application/use-cases/DeleteAreaUseCase';
import { CreateAreaDTO } from '../../../application/dtos/CreateAreaDTO';
import { UpdateAreaDTO } from '../../../application/dtos/UpdateAreaDTO';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@injectable()
export class AreaController {
  constructor(
    @inject(CreateAreaUseCase) private createAreaUseCase: CreateAreaUseCase,
    @inject(UpdateAreaUseCase) private updateAreaUseCase: UpdateAreaUseCase,
    @inject(GetAreaUseCase) private getAreaUseCase: GetAreaUseCase,
    @inject(ListAreasUseCase) private listAreasUseCase: ListAreasUseCase,
    @inject(DeleteAreaUseCase) private deleteAreaUseCase: DeleteAreaUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(CreateAreaDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const area = await this.createAreaUseCase.execute(dto);
      res.status(201).json(area.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(UpdateAreaDTO, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
      }

      const area = await this.updateAreaUseCase.execute(req.params.id, dto);
      res.json(area.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const area = await this.getAreaUseCase.execute(req.params.id);
      res.json(area.toJSON());
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const areas = await this.listAreasUseCase.execute(activeOnly);
      res.json(areas.map((a) => a.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.deleteAreaUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
