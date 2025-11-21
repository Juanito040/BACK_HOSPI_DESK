import { inject, injectable } from 'tsyringe';
import { SLA } from '../../domain/entities/SLA';
import { ISLARepository } from '../../domain/repositories/ISLARepository';

@injectable()
export class GetSLAUseCase {
  constructor(
    @inject('ISLARepository') private slaRepository: ISLARepository
  ) {}

  async execute(id: string): Promise<SLA> {
    const sla = await this.slaRepository.findById(id);

    if (!sla) {
      throw new Error('SLA not found');
    }

    return sla;
  }
}
