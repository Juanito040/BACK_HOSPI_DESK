import { inject, injectable } from 'tsyringe';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { PhoneNumber } from '../../domain/value-objects/PhoneNumber';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IPasswordHasher') private passwordHasher: IPasswordHasher
  ) {}

  async execute(id: string, dto: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (dto.name) {
      user.updateName(dto.name);
    }

    if (dto.email) {
      const newEmail = new Email(dto.email);
      // Check if email is already taken by another user
      const existingUser = await this.userRepository.findByEmail(newEmail);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already in use by another user');
      }
      user.updateEmail(newEmail);
    }

    if (dto.phone !== undefined) {
      user.updatePhone(dto.phone ? new PhoneNumber(dto.phone) : undefined);
    }

    if (dto.role) {
      user.changeRole(dto.role);
    }

    if (dto.areaId !== undefined) {
      if (dto.areaId) {
        user.assignToArea(dto.areaId);
      }
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        user.activate();
      } else {
        user.deactivate();
      }
    }

    if (dto.password) {
      const passwordHash = await this.passwordHasher.hash(dto.password);
      user.updatePassword(passwordHash);
    }

    return await this.userRepository.update(user);
  }
}
