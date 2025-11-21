import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';

export enum UserRole {
  REQUESTER = 'REQUESTER',
  AGENT = 'AGENT',
  TECH = 'TECH',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  id: string;
  name: string;
  email: Email;
  phone?: PhoneNumber;
  role: UserRole;
  areaId?: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props);
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get phone(): PhoneNumber | undefined {
    return this.props.phone;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get areaId(): string | undefined {
    return this.props.areaId;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }

  isAgent(): boolean {
    return this.props.role === UserRole.AGENT || this.props.role === UserRole.TECH;
  }

  isTechnician(): boolean {
    return this.props.role === UserRole.TECH;
  }

  isRequester(): boolean {
    return this.props.role === UserRole.REQUESTER;
  }

  canManageArea(areaId: string): boolean {
    if (this.isAdmin()) return true;
    return this.props.areaId === areaId;
  }

  canAssignTickets(): boolean {
    return this.isAdmin() || this.isAgent();
  }

  canResolveTickets(): boolean {
    return this.isAdmin() || this.isTechnician() || this.isAgent();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateEmail(email: Email): void {
    this.props.email = email;
    this.props.updatedAt = new Date();
  }

  updatePhone(phone: PhoneNumber | undefined): void {
    this.props.phone = phone;
    this.props.updatedAt = new Date();
  }

  changeRole(role: UserRole): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  assignToArea(areaId: string): void {
    this.props.areaId = areaId;
    this.props.updatedAt = new Date();
  }

  updatePassword(passwordHash: string): void {
    this.props.passwordHash = passwordHash;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      name: this.props.name,
      email: this.props.email.getValue(),
      phone: this.props.phone?.getValue(),
      role: this.props.role,
      areaId: this.props.areaId,
      isActive: this.props.isActive,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
