/**
 * Lumino Framework - Mapper Registry
 *
 * Central registry for all data mappers.
 */

import type { BuiltMapper } from "../types/api";

// =============================================================================
// MAPPER REGISTRY
// =============================================================================

/**
 * Static registry for managing data mappers.
 * Mappers auto-register when instantiated via LuminoApp config.
 *
 * @example
 * ```typescript
 * // In LuminoApp config
 * const app = new LuminoApp({
 *   mappers: [UserMapper, AddressMapper],
 * });
 *
 * // Access mapper
 * const mapper = MapperRegistry.get("UserMapper");
 * ```
 */
export class MapperRegistry {
  private static _mappers: Map<string, BuiltMapper<any, any>> = new Map();

  /**
   * Register a mapper by name
   */
  static register(name: string, mapper: BuiltMapper<any, any>): void {
    this._mappers.set(name, mapper);
  }

  /**
   * Get mapper by name
   */
  static get(name: string): BuiltMapper<any, any> | undefined {
    return this._mappers.get(name);
  }

  /**
   * Check if mapper exists
   */
  static has(name: string): boolean {
    return this._mappers.has(name);
  }

  /**
   * Get all mapper names
   */
  static getNames(): string[] {
    return Array.from(this._mappers.keys());
  }

  /**
   * Get all mappers
   */
  static getAll(): Map<string, BuiltMapper<any, any>> {
    return new Map(this._mappers);
  }

  /**
   * Clear all registrations
   */
  static clear(): void {
    this._mappers.clear();
  }
}
