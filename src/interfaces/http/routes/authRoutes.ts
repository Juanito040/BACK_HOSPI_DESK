import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validationMiddleware } from '../middlewares/ValidationMiddleware';
import { LoginDTO, CreateUserDTO } from '../../../application/dtos';

const router = Router();

router.post('/login', validationMiddleware(LoginDTO), AuthController.login);

router.post('/register', validationMiddleware(CreateUserDTO), AuthController.register);

router.post('/request-password-reset', AuthController.requestPasswordReset);

router.post('/reset-password', AuthController.resetPassword);

export default router;
