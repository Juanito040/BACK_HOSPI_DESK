import { Ticket } from '../entities/Ticket';
import { Status } from '../value-objects/Status';
import { Priority } from '../value-objects/Priority';
import { PaginationParams, PaginatedResult } from '../types/Pagination';

export interface TicketFilters {
  status?: Status;
  priority?: Priority;
  areaId?: string;
  requesterId?: string;
  assignedToId?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  searchText?: string;
}

export interface ITicketRepository {
  save(ticket: Ticket): Promise<Ticket>;
  findById(id: string): Promise<Ticket | null>;
  findAll(filters?: TicketFilters): Promise<Ticket[]>;
  findAllPaginated(
    filters?: TicketFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Ticket>>;
  findByRequester(requesterId: string): Promise<Ticket[]>;
  findByAssignee(assigneeId: string): Promise<Ticket[]>;
  findByArea(areaId: string): Promise<Ticket[]>;
  findOverdueSLA(areaId?: string): Promise<Ticket[]>;
  update(ticket: Ticket): Promise<Ticket>;
  delete(id: string): Promise<void>;
}
