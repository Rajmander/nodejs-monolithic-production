import { describe, it, expect, vi } from 'vitest';

import { EventBus } from '../../src/core/events/event-bus.js';

describe('EventBus', () => {
  it('should publish and receive domain events asynchronously', async () => {
    const bus = EventBus.getInstance();
    const handler = vi.fn();

    bus.subscribe('order.created', handler);
    bus.publish('order.created', { orderId: 'ord-123' }, 'trace-abc');

    // Yield to allow event tick
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(handler).toHaveBeenCalled();
    const event = handler.mock.calls[0][0];
    expect(event.eventName).toBe('order.created');
    expect(event.payload.orderId).toBe('ord-123');
    expect(event.correlationId).toBe('trace-abc');

    bus.clearAll();
  });

  it('should gracefully handle errors thrown inside listener without crashing', async () => {
    const bus = EventBus.getInstance();
    const faultyHandler = () => {
      throw new Error('Boom in listener');
    };

    bus.subscribe('faulty.topic', faultyHandler);
    expect(() => bus.publish('faulty.topic', {})).not.toThrow();

    await new Promise(resolve => setTimeout(resolve, 50));
    bus.clearAll();
  });
});
