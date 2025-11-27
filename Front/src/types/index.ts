export enum UserRole {
  REQUESTER = 'REQUESTER',
  AGENT = 'AGENT',
  TECH = 'TECH',
  ADMIN = 'ADMIN',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  areaId?: string;
  area?: Area;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  areaId?: string;
  area?: Area;
  requesterId: string;
  requester: User;
  assignedToId?: string;
  assignedTo?: User;
  resolution?: string;
  responseTime?: string;
  resolutionTime?: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  user: User;
  content: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  ticketId: string;
  userId: string;
  user: User;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

export interface SLA {
  id: string;
  areaId: string;
  area: Area;
  priority: TicketPriority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditTrail {
  id: string;
  ticketId: string;
  actorId: string;
  actor: User;
  action: string;
  details: Record<string, any>;
  occurredAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
  areaId?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  areaId?: string;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
  resolution?: string;
}

export interface AssignTicketRequest {
  assignedToId: string;
}

export interface CreateCommentRequest {
  ticketId: string;
  content: string;
  isInternal: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  areaId?: string;
  requesterId?: string;
  assignedToId?: string;
  searchText?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
