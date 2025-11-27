import { inject, injectable } from 'tsyringe';
import { IAreaRepository } from '../../domain/repositories/IAreaRepository';

@injectable()
export class DeleteAreaUseCase {
  constructor(
    @inject('IAreaRepository') private areaRepository: IAreaRepository
  ) {}

  async execute(id: string): Promise<void> {
    const area = await this.areaRepository.findById(id);

    if (!area) {
      throw new Error('Area not found');
    }

    await this.areaRepository.delete(id);
  }
}
