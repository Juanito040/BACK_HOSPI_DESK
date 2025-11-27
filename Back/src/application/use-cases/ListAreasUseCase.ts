import { inject, injectable } from 'tsyringe';
import { Area } from '../../domain/entities/Area';
import { IAreaRepository } from '../../domain/repositories/IAreaRepository';

@injectable()
export class ListAreasUseCase {
  constructor(
    @inject('IAreaRepository') private areaRepository: IAreaRepository
  ) {}

  async execute(activeOnly: boolean = false): Promise<Area[]> {
    if (activeOnly) {
      return await this.areaRepository.findActiveAreas();
    }
    return await this.areaRepository.findAll();
  }
}
