import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(id);
  }
}
