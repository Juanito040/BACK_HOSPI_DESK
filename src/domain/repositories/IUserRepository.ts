import { User, UserRole } from '../entities/User';
import { Email } from '../value-objects/Email';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByRole(role: UserRole): Promise<User[]>;
  findByArea(areaId: string): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  updatePasswordResetToken(userId: string, token: string, expires: Date): Promise<void>;
  findByResetToken(token: string): Promise<User | null>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  clearPasswordResetToken(userId: string): Promise<void>;
}
