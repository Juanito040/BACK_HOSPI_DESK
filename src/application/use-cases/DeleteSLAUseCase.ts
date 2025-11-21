import { inject, injectable } from 'tsyringe';
import { ISLARepository } from '../../domain/repositories/ISLARepository';

@injectable()
export class DeleteSLAUseCase {
  constructor(
    @inject('ISLARepository') private slaRepository: ISLARepository
  ) {}

  async execute(id: string): Promise<void> {
    const sla = await this.slaRepository.findById(id);

    if (!sla) {
      throw new Error('SLA not found');
    }

    await this.slaRepository.delete(id);
  }
}
