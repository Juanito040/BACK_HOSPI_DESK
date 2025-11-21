import { inject, injectable } from 'tsyringe';
import { SLA } from '../../domain/entities/SLA';
import { ISLARepository } from '../../domain/repositories/ISLARepository';

@injectable()
export class ListSLAsUseCase {
  constructor(
    @inject('ISLARepository') private slaRepository: ISLARepository
  ) {}

  async execute(areaId?: string): Promise<SLA[]> {
    if (areaId) {
      return await this.slaRepository.findByArea(areaId);
    }
    return await this.slaRepository.findAll();
  }
}
