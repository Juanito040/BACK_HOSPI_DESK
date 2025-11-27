import { inject, injectable } from 'tsyringe';
import { Area } from '../../domain/entities/Area';
import { IAreaRepository } from '../../domain/repositories/IAreaRepository';

@injectable()
export class GetAreaUseCase {
  constructor(
    @inject('IAreaRepository') private areaRepository: IAreaRepository
  ) {}

  async execute(id: string): Promise<Area> {
    const area = await this.areaRepository.findById(id);

    if (!area) {
      throw new Error('Area not found');
    }

    return area;
  }
}
