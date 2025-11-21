import { inject, injectable } from 'tsyringe';
import { Area } from '../../domain/entities/Area';
import { IAreaRepository } from '../../domain/repositories/IAreaRepository';
import { UpdateAreaDTO } from '../dtos/UpdateAreaDTO';

@injectable()
export class UpdateAreaUseCase {
  constructor(
    @inject('IAreaRepository') private areaRepository: IAreaRepository
  ) {}

  async execute(id: string, dto: UpdateAreaDTO): Promise<Area> {
    const area = await this.areaRepository.findById(id);

    if (!area) {
      throw new Error('Area not found');
    }

    if (dto.name !== undefined) {
      area.updateName(dto.name);
    }

    if (dto.description !== undefined) {
      area.updateDescription(dto.description);
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        area.activate();
      } else {
        area.deactivate();
      }
    }

    return await this.areaRepository.update(area);
  }
}
