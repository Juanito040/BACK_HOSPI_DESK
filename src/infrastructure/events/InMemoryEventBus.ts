import { injectable } from 'tsyringe';
import { DomainEvent } from '../../domain/events/DomainEvent';
import { IEventBus, EventHandler } from '../../domain/services/IEventBus';
import { logger } from '../../config/logger';

@injectable()
export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName)!.push(handler);
    logger.info(`Subscribed handler to event: ${eventName}`);
  }

  unsubscribe(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        logger.info(`Unsubscribed handler from event: ${eventName}`);
      }
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName);

    if (!handlers || handlers.length === 0) {
      logger.debug(`No handlers registered for event: ${event.eventName}`);
      return;
    }

    logger.info(`Publishing event: ${event.eventName}`, {
      aggregateId: event.aggregateId,
      occurredOn: event.occurredOn,
    });

    const promises = handlers.map((handler) =>
      handler(event).catch((error) => {
        logger.error(`Error handling event ${event.eventName}:`, error);
      })
    );

    await Promise.all(promises);
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
