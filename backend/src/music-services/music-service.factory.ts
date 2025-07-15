/**
 * MusicServiceFactory is a factory class responsible for managing and providing access
 * to different music service implementations (such as Spotify, YouTube, etc.) in a scalable way.
 *
 * How it works:
 * - It maintains a map (serviceMap) that associates a ServiceType (like 'SPOTIFY') with a corresponding
 *   service class that implements the IMusicService interface.
 * - Services are registered using the registerService method, typically during application/module initialization.
 * - When you need a specific music service, you call getService with the desired ServiceType.
 *   This returns the class (not an instance) for that service, which you can then instantiate as needed.
 * - getSupportedServices returns a list of all registered service types.
 *
 * This pattern allows the application to easily support multiple music services and add new ones
 * without changing the core logic. It also helps with dependency injection and loose coupling.
 */

import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  IMusicService,
  ServiceType,
} from './interfaces/music-service.interface';

@Injectable()
export class MusicServiceFactory {
  // Maps a service type (e.g., 'SPOTIFY') to its corresponding service class
  private serviceMap = new Map<ServiceType, Type<IMusicService>>();

  constructor(private moduleRef: ModuleRef) {}

  /**
   * Register a music service class for a given service type.
   * Typically called during module initialization.
   */
  registerService(type: ServiceType, serviceClass: Type<IMusicService>) {
    this.serviceMap.set(type, serviceClass);
  }

  /**
   * Retrieve the service class for a given service type.
   * Throws an error if the service is not registered.
   */
  getService(type: ServiceType): IMusicService {
    const ServiceClass = this.serviceMap.get(type);
    if (!ServiceClass) {
      throw new Error(`Music service ${type} not found`);
    }

    // Get an instance of the service with all dependencies injected
    return this.moduleRef.get(ServiceClass);
  }

  /**
   * Get a list of all supported (registered) service types.
   */
  getSupportedServices(): ServiceType[] {
    return Array.from(this.serviceMap.keys());
  }
}
