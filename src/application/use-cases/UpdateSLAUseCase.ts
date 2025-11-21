import { inject, injectable } from 'tsyringe';
import { SLA } from '../../domain/entities/SLA';
import { ISLARepository } from '../../domain/repositories/ISLARepository';
import { UpdateSLADTO } from '../dtos/UpdateSLADTO';

@injectable()
export class UpdateSLAUseCase {
  constructor(
    @inject('ISLARepository') private slaRepository: ISLARepository
  ) {}

  async execute(id: string, dto: UpdateSLADTO): Promise<SLA> {
    const sla = await this.slaRepository.findById(id);

    if (!sla) {
      throw new Error('SLA not found');
    }

    if (dto.responseTimeMinutes !== undefined) {
      sla.updateResponseTime(dto.responseTimeMinutes);
    }

    if (dto.resolutionTimeMinutes !== undefined) {
      sla.updateResolutionTime(dto.resolutionTimeMinutes);
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        sla.activate();
      } else {
        sla.deactivate();
      }
    }

    return await this.slaRepository.update(sla);
  }
}
