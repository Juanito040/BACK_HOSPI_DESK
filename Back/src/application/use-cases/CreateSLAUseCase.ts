import { inject, injectable } from 'tsyringe';
import { SLA } from '../../domain/entities/SLA';
import { Priority } from '../../domain/value-objects/Priority';
import { ISLARepository } from '../../domain/repositories/ISLARepository';
import { CreateSLADTO } from '../dtos/CreateSLADTO';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class CreateSLAUseCase {
  constructor(
    @inject('ISLARepository') private slaRepository: ISLARepository
  ) {}

  async execute(dto: CreateSLADTO): Promise<SLA> {
    // Validate that resolution time is greater than response time
    if (dto.resolutionTimeMinutes <= dto.responseTimeMinutes) {
      throw new Error('Resolution time must be greater than response time');
    }

    const sla = SLA.create({
      id: uuidv4(),
      areaId: dto.areaId,
      priority: Priority.fromString(dto.priority),
      responseTimeMinutes: dto.responseTimeMinutes,
      resolutionTimeMinutes: dto.resolutionTimeMinutes,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.slaRepository.save(sla);
  }
}
