import { inject, injectable } from 'tsyringe';
import { Area } from '../../domain/entities/Area';
import { IAreaRepository } from '../../domain/repositories/IAreaRepository';
import { CreateAreaDTO } from '../dtos/CreateAreaDTO';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class CreateAreaUseCase {
  constructor(
    @inject('IAreaRepository') private areaRepository: IAreaRepository
  ) {}

  async execute(dto: CreateAreaDTO): Promise<Area> {
    const area = Area.create({
      id: uuidv4(),
      name: dto.name,
      description: dto.description,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.areaRepository.save(area);
  }
}
