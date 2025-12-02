/**
 * Lumino Framework - Mapper
 *
 * Transforms data between API format (Entity) and UI format (DTO).
 * Supports field mapping, transformations, computed fields.
 */

import type {
  BuiltMapper,
  FieldMappingConfig,
  ComputedFieldConfig,
  FieldMappingBuilder,
  ComputedFieldBuilder,
} from "../types/api";
import { MapperRegistry } from "../registry/MapperRegistry";

// =============================================================================
// FIELD MAPPING BUILDER IMPLEMENTATION
// =============================================================================

class FieldMappingBuilderImpl<TDto, TEntity, TParent>
  implements FieldMappingBuilder<TDto, TEntity, TParent>
{
  private _config: Partial<FieldMappingConfig<TDto, TEntity>> = {};
  private _parent: TParent;
  private _onComplete: (config: FieldMappingConfig<TDto, TEntity>) => void;

  constructor(
    parent: TParent,
    onComplete: (config: FieldMappingConfig<TDto, TEntity>) => void
  ) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  dto(field: keyof TDto): FieldMappingBuilder<TDto, TEntity, TParent> {
    this._config.dtoField = field;
    return this;
  }

  entity(field: keyof TEntity): FieldMappingBuilder<TDto, TEntity, TParent> {
    this._config.entityField = field;
    return this;
  }

  toDTO(
    fn: (value: any, entity: TEntity) => any
  ): FieldMappingBuilder<TDto, TEntity, TParent> {
    this._config.toDTO = fn;
    return this;
  }

  toEntity(
    fn: (value: any, dto: TDto) => any
  ): FieldMappingBuilder<TDto, TEntity, TParent> {
    this._config.toEntity = fn;
    return this;
  }

  end(): TParent {
    if (!this._config.dtoField || !this._config.entityField) {
      throw new Error("FieldMapping: both dto and entity fields are required");
    }
    this._onComplete(this._config as FieldMappingConfig<TDto, TEntity>);
    return this._parent;
  }
}

// =============================================================================
// COMPUTED FIELD BUILDER IMPLEMENTATION
// =============================================================================

class ComputedFieldBuilderImpl<TDto, TEntity, TParent>
  implements ComputedFieldBuilder<TDto, TEntity, TParent>
{
  private _config: Partial<ComputedFieldConfig<TDto, TEntity>> = {};
  private _parent: TParent;
  private _onComplete: (config: ComputedFieldConfig<TDto, TEntity>) => void;

  constructor(
    parent: TParent,
    onComplete: (config: ComputedFieldConfig<TDto, TEntity>) => void
  ) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  dto(field: keyof TDto): ComputedFieldBuilder<TDto, TEntity, TParent> {
    this._config.dtoField = field;
    return this;
  }

  entity(field: keyof TEntity): ComputedFieldBuilder<TDto, TEntity, TParent> {
    this._config.entityField = field;
    return this;
  }

  value(fn: (source: any) => any): ComputedFieldBuilder<TDto, TEntity, TParent> {
    this._config.value = fn;
    return this;
  }

  end(): TParent {
    if (!this._config.value) {
      throw new Error("ComputedField: value function is required");
    }
    if (!this._config.dtoField && !this._config.entityField) {
      throw new Error("ComputedField: either dto or entity field is required");
    }
    this._onComplete(this._config as ComputedFieldConfig<TDto, TEntity>);
    return this._parent;
  }
}

// =============================================================================
// MAPPER CLASS
// =============================================================================

/**
 * Mapper for transforming data between DTO and Entity formats.
 * Registration happens automatically after constructor completes.
 *
 * @example
 * ```typescript
 * class UserMapper extends Mapper<UserDTO, UserEntity> {
 *   constructor() {
 *     super("UserMapper");
 *
 *     this.field()
 *       .dto("userName")
 *       .entity("user_name")
 *       .toDTO((value) => value.toUpperCase())
 *       .toEntity((value) => value.toLowerCase())
 *       .end();
 *
 *     this.field()
 *       .dto("email")
 *       .entity("email_address")
 *       .end();
 *
 *     this.computed()
 *       .dto("fullName")
 *       .value((entity) => `${entity.first_name} ${entity.last_name}`)
 *       .end();
 *
 *     this.ignore("password", "token");
 *   }
 *   // Registration happens automatically
 * }
 * ```
 */
export abstract class Mapper<TDto, TEntity> {
  protected _name: string;
  protected _fieldMappings: Map<string, FieldMappingConfig<TDto, TEntity>> =
    new Map();
  protected _computedDTO: Map<keyof TDto, (source: TEntity) => any> = new Map();
  protected _computedEntity: Map<keyof TEntity, (source: TDto) => any> =
    new Map();
  protected _ignoredFields: Set<string> = new Set();

  constructor(name: string) {
    this._name = name;
    // Defer registration to allow subclass constructor to complete
    queueMicrotask(() => this._register());
  }

  /**
   * Internal registration - called automatically after constructor
   */
  private _register(): void {
    const built = this.build();
    MapperRegistry.register(this._name, built);
  }

  /**
   * Define field mapping between DTO and Entity
   */
  field(): FieldMappingBuilder<TDto, TEntity, this> {
    return new FieldMappingBuilderImpl(this, (config) => {
      // Store mapping by entity field name (for toDTO)
      this._fieldMappings.set(config.entityField as string, config);
    });
  }

  /**
   * Define computed field for DTO or Entity
   */
  computed(): ComputedFieldBuilder<TDto, TEntity, this> {
    return new ComputedFieldBuilderImpl(this, (config) => {
      if (config.dtoField) {
        this._computedDTO.set(config.dtoField, config.value);
      }
      if (config.entityField) {
        this._computedEntity.set(config.entityField, config.value);
      }
    });
  }

  /**
   * Ignore fields during mapping
   */
  ignore(...fields: string[]): this {
    fields.forEach((f) => this._ignoredFields.add(f));
    return this;
  }

  /**
   * Build the mapper
   */
  build(): BuiltMapper<TDto, TEntity> {
    const name = this._name;
    const fieldMappings = new Map(this._fieldMappings);
    const computedDTO = new Map(this._computedDTO);
    const computedEntity = new Map(this._computedEntity);
    const ignoredFields = new Set(this._ignoredFields);

    // Create reverse mapping (dto field -> entity field) for toEntity
    const reverseMappings = new Map<string, FieldMappingConfig<TDto, TEntity>>();
    fieldMappings.forEach((mapping) => {
      reverseMappings.set(mapping.dtoField as string, mapping);
    });

    const builtMapper: BuiltMapper<TDto, TEntity> = {
      name,

      toDTO(entity: TEntity): TDto {
        if (!entity) return entity as any;

        const result: any = {};
        const entityObj = entity as Record<string, any>;

        // Process each field in entity
        for (const key of Object.keys(entityObj)) {
          if (ignoredFields.has(key)) continue;

          const value = entityObj[key];

          // Check if explicit mapping exists
          if (fieldMappings.has(key)) {
            const mapping = fieldMappings.get(key)!;
            const transformedValue = mapping.toDTO
              ? mapping.toDTO(value, entity)
              : value;
            result[mapping.dtoField] = transformedValue;
          }
          // Auto-map same name fields
          else {
            result[key] = value;
          }
        }

        // Apply computed DTO fields
        computedDTO.forEach((computeFn, field) => {
          result[field] = computeFn(entity);
        });

        return result as TDto;
      },

      toEntity(dto: TDto): TEntity {
        if (!dto) return dto as any;

        const result: any = {};
        const dtoObj = dto as Record<string, any>;

        // Get all computed DTO field names to skip them
        const computedDTOFields = new Set(computedDTO.keys());

        // Process each field in DTO
        for (const key of Object.keys(dtoObj)) {
          // Skip computed DTO fields (they don't go to entity)
          if (computedDTOFields.has(key as keyof TDto)) continue;
          if (ignoredFields.has(key)) continue;

          const value = dtoObj[key];

          // Check if explicit mapping exists
          if (reverseMappings.has(key)) {
            const mapping = reverseMappings.get(key)!;
            const transformedValue = mapping.toEntity
              ? mapping.toEntity(value, dto)
              : value;
            result[mapping.entityField] = transformedValue;
          }
          // Auto-map same name fields
          else {
            result[key] = value;
          }
        }

        // Apply computed Entity fields
        computedEntity.forEach((computeFn, field) => {
          result[field] = computeFn(dto);
        });

        return result as TEntity;
      },

      toDTOList(entities: TEntity[]): TDto[] {
        if (!entities) return [];
        return entities.map((e) => builtMapper.toDTO(e));
      },

      toEntityList(dtos: TDto[]): TEntity[] {
        if (!dtos) return [];
        return dtos.map((d) => builtMapper.toEntity(d));
      },
    };

    return builtMapper;
  }

  /**
   * Get the built mapper (for subclass constructor usage)
   */
  protected getBuiltMapper(): BuiltMapper<TDto, TEntity> {
    return this.build();
  }
}
