import { Notification } from '@/domain/entities/Notification';
import { IBusinessAccountRepository } from '@/domain/repositories/IBusinessAccountRepository';

export class GetBusinessNotificationsUseCase {
  constructor(private businessAccountRepository: IBusinessAccountRepository) {}
 
  async execute(): Promise<Notification[]> {
    return this.businessAccountRepository.getNotifications();
  }
} 