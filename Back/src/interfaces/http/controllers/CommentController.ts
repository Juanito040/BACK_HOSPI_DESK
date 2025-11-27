import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AddCommentUseCase } from '../../../application/use-cases';

export class CommentController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = container.resolve(AddCommentUseCase);
      const comment = await useCase.execute(req.body);

      res.status(201).json(comment.toJSON());
    } catch (error) {
      next(error);
    }
  }
}
