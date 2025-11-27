import { inject, injectable } from 'tsyringe';
import { Ticket } from '../../domain/entities/Ticket';
import { ITicketRepository, TicketFilters } from '../../domain/repositories/ITicketRepository';
import { PaginationParams, PaginatedResult } from '../../domain/types/Pagination';

@injectable()
export class ListTicketsUseCase {
  constructor(@inject('ITicketRepository') private ticketRepository: ITicketRepository) {}

  async execute(filters?: TicketFilters): Promise<Ticket[]> {
    return this.ticketRepository.findAll(filters);
  }

  async executePaginated(
    filters?: TicketFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<Ticket>> {
    return this.ticketRepository.findAllPaginated(filters, pagination);
  }
}
