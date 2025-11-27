import { inject, injectable } from 'tsyringe';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { PhoneNumber } from '../../domain/value-objects/PhoneNumber';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IPasswordHasher') private passwordHasher: IPasswordHasher
  ) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    const email = new Email(dto.email);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const now = new Date();
    const user = User.create({
      id: uuidv4(),
      name: dto.name,
      email,
      phone: dto.phone ? new PhoneNumber(dto.phone) : undefined,
      role: dto.role,
      areaId: dto.areaId,
      passwordHash,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return this.userRepository.save(user);
  }
}
