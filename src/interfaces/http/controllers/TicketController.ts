import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import {
  CreateTicketUseCase,
  AssignTicketUseCase,
  UpdateTicketStatusUseCase,
  GetTicketDetailsUseCase,
  ListTicketsUseCase,
} from '../../../application/use-cases';
import { AuthRequest } from '../middlewares/AuthMiddleware';

export class TicketController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(CreateTicketUseCase);
      const ticket = await useCase.execute(req.body);

      res.status(201).json(ticket.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(GetTicketDetailsUseCase);
      const details = await useCase.execute(req.params.id);

      res.json({
        ticket: details.ticket.toJSON(),
        comments: details.comments.map((c) => c.toJSON()),
        attachments: details.attachments.map((a) => a.toJSON()),
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(ListTicketsUseCase);

      // Check if pagination is requested
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined;
      const usePagination = page !== undefined || pageSize !== undefined;

      // Build filters from query params
      const filters: Record<string, unknown> = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.priority) filters.priority = req.query.priority;
      if (req.query.areaId) filters.areaId = req.query.areaId;
      if (req.query.requesterId) filters.requesterId = req.query.requesterId;
      if (req.query.assignedToId) filters.assignedToId = req.query.assignedToId;
      if (req.query.searchText) filters.searchText = req.query.searchText;

      if (usePagination) {
        // Return paginated results
        const pagination = {
          page: page || 1,
          pageSize: pageSize || 10,
          sortBy: (req.query.sortBy as string) || 'createdAt',
          sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        };

        const result = await useCase.executePaginated(filters, pagination);

        res.json({
          data: result.data.map((t) => t.toJSON()),
          pagination: result.pagination,
        });
      } else {
        // Return all results (legacy behavior)
        const tickets = await useCase.execute(filters);
        res.json(tickets.map((t) => t.toJSON()));
      }
    } catch (error) {
      next(error);
    }
  }

  static async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(AssignTicketUseCase);
      const authReq = req as AuthRequest;
      const assignedById = authReq.user?.userId || '';

      const ticket = await useCase.execute(
        req.params.id,
        req.body.assignedToId,
        assignedById,
        req.body.comment // Optional comment for reassignment
      );

      res.json(ticket.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(UpdateTicketStatusUseCase);
      const authReq = req as AuthRequest;
      const changedById = authReq.user?.userId || '';

      const ticket = await useCase.execute(req.params.id, req.body.status, changedById);

      res.json(ticket.toJSON());
    } catch (error) {
      next(error);
    }
  }
}
