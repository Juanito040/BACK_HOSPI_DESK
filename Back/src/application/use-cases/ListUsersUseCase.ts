import { inject, injectable } from 'tsyringe';
import { User, UserRole } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

@injectable()
export class ListUsersUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async execute(filters?: {
    role?: UserRole;
    areaId?: string;
    activeOnly?: boolean;
  }): Promise<User[]> {
    if (filters?.role) {
      return await this.userRepository.findByRole(filters.role);
    }

    if (filters?.areaId) {
      return await this.userRepository.findByArea(filters.areaId);
    }

    if (filters?.activeOnly) {
      return await this.userRepository.findActiveUsers();
    }

    return await this.userRepository.findAll();
  }
}
