/**
 * @file event-bus.js
 * @description In-process asynchronous Domain Event Bus for decoupled cross-module communication.
 */

import { EventEmitter } from 'events';

import { logger } from '../logger/index.js';

/**
 * @typedef {Object} DomainEvent
 * @property {string} id Unique event identifier
 * @property {string} eventName Name of the domain event topic
 * @property {Date} occurredOn Timestamp of event creation
 * @property {*} payload Data payload of the event
 * @property {string} [correlationId] Correlation ID for distributed tracing
 */

/**
 * In-process asynchronous Domain Event Bus.
 */
export class EventBus {
  /** @type {EventBus} */
  static #instance;

  /** @type {EventEmitter} */
  #emitter;

  constructor() {
    this.#emitter = new EventEmitter();
    this.#emitter.setMaxListeners(50);
  }

  /**
   * Retrieves singleton instance of EventBus.
   * @returns {EventBus}
   */
  static getInstance() {
    if (!EventBus.#instance) {
      EventBus.#instance = new EventBus();
    }
    return EventBus.#instance;
  }

  /**
   * Publishes an asynchronous domain event to all subscribers.
   * @param {string} eventName Event topic name
   * @param {*} payload Event payload data
   * @param {string} [correlationId] Tracing correlation ID
   */
  publish(eventName, payload, correlationId) {
    const event = {
      id: Math.random().toString(36).substring(2, 11),
      eventName,
      occurredOn: new Date(),
      payload,
      correlationId,
    };

    logger.debug({ eventName, correlationId, eventId: event.id }, 'Publishing domain event');
    this.#emitter.emit(eventName, event);
  }

  /**
   * Subscribes an asynchronous handler to a domain event topic.
   * @param {string} eventName Event topic name
   * @param {function(DomainEvent): (Promise<void>|void)} handler Event handler function
   */
  subscribe(eventName, handler) {
    this.#emitter.on(eventName, async event => {
      try {
        await handler(event);
      } catch (error) {
        logger.error(
          {
            err: error,
            eventName,
            eventId: event.id,
            correlationId: event.correlationId,
          },
          'Unhandled exception in domain event handler',
        );
      }
    });
  }

  /**
   * Clears all event listeners (useful in tests).
   */
  clearAll() {
    this.#emitter.removeAllListeners();
  }
}

export const eventBus = EventBus.getInstance();
export default eventBus;
