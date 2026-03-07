import { BaseService } from './base.service'

// Re-export all BaseService functionality for backward compatibility
export class DatabaseService extends BaseService {
  // Legacy method names for backward compatibility
  static generateOrderId = BaseService.ID_GENERATORS.order
  static generatePaymentId = BaseService.ID_GENERATORS.payment
  static getOrCreateUserId = BaseService.getOrCreateUser
}