import { injectable, inject } from 'tsyringe';
import { randomBytes } from 'crypto';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { logger } from '../../config/logger';

@injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(email: string): Promise<string> {
    const { Email } = await import('../../domain/value-objects/Email');
    const emailVO = new Email(email);
    const user = await this.userRepository.findByEmail(emailVO);

    if (!user) {
      // Don't reveal if user exists for security reasons
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return 'If an account with that email exists, a password reset link has been sent.';
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token (this requires extending User entity)
    // For now, we'll save it directly via repository
    await this.userRepository.updatePasswordResetToken(user.id, resetToken, resetExpires);

    logger.info(`Password reset token generated for user: ${user.email}`);

    // TODO: Send email with reset link
    // In production, you would send an email here with the reset token
    // For now, return the token (remove this in production!)
    return resetToken;
  }
}
