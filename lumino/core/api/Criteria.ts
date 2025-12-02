/**
 * Lumino Framework - Criteria Builder
 *
 * Type-safe query builder for server-side search operations.
 * Generates JSON criteria that can be sent to backend.
 */

// =============================================================================
// CRITERIA TYPES
// =============================================================================

export type CriteriaOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "in"
  | "notIn"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "isNull"
  | "isNotNull"
  | "before"
  | "after";

export interface CriteriaCondition {
  field: string;
  operator: CriteriaOperator;
  value: any;
}

export interface CriteriaGroup {
  type: "and" | "or";
  conditions: Array<CriteriaCondition | CriteriaGroup>;
}

export interface BuiltCriteria {
  conditions: Array<CriteriaCondition | CriteriaGroup>;
  toJSON(): any;
}

// =============================================================================
// FIELD CRITERIA BUILDER
// =============================================================================

/**
 * Builder for field-level criteria conditions
 */
class FieldCriteriaBuilder<TEntity, TParent> {
  private _field: string;
  private _parent: TParent;
  private _addCondition: (condition: CriteriaCondition) => void;

  constructor(
    field: string,
    parent: TParent,
    addCondition: (condition: CriteriaCondition) => void
  ) {
    this._field = field;
    this._parent = parent;
    this._addCondition = addCondition;
  }

  /**
   * Equal to
   */
  eq(value: any): TParent {
    this._addCondition({ field: this._field, operator: "eq", value });
    return this._parent;
  }

  /**
   * Not equal to
   */
  ne(value: any): TParent {
    this._addCondition({ field: this._field, operator: "ne", value });
    return this._parent;
  }

  /**
   * Greater than
   */
  gt(value: any): TParent {
    this._addCondition({ field: this._field, operator: "gt", value });
    return this._parent;
  }

  /**
   * Greater than or equal
   */
  gte(value: any): TParent {
    this._addCondition({ field: this._field, operator: "gte", value });
    return this._parent;
  }

  /**
   * Less than
   */
  lt(value: any): TParent {
    this._addCondition({ field: this._field, operator: "lt", value });
    return this._parent;
  }

  /**
   * Less than or equal
   */
  lte(value: any): TParent {
    this._addCondition({ field: this._field, operator: "lte", value });
    return this._parent;
  }

  /**
   * Between range (inclusive)
   */
  between(min: any, max: any): TParent {
    this._addCondition({ field: this._field, operator: "between", value: [min, max] });
    return this._parent;
  }

  /**
   * In array of values
   */
  in(values: any[]): TParent {
    this._addCondition({ field: this._field, operator: "in", value: values });
    return this._parent;
  }

  /**
   * Not in array of values
   */
  notIn(values: any[]): TParent {
    this._addCondition({ field: this._field, operator: "notIn", value: values });
    return this._parent;
  }

  /**
   * String contains
   */
  contains(value: string): TParent {
    this._addCondition({ field: this._field, operator: "contains", value });
    return this._parent;
  }

  /**
   * String starts with
   */
  startsWith(value: string): TParent {
    this._addCondition({ field: this._field, operator: "startsWith", value });
    return this._parent;
  }

  /**
   * String ends with
   */
  endsWith(value: string): TParent {
    this._addCondition({ field: this._field, operator: "endsWith", value });
    return this._parent;
  }

  /**
   * Is null
   */
  isNull(): TParent {
    this._addCondition({ field: this._field, operator: "isNull", value: true });
    return this._parent;
  }

  /**
   * Is not null
   */
  isNotNull(): TParent {
    this._addCondition({ field: this._field, operator: "isNotNull", value: true });
    return this._parent;
  }

  /**
   * Date before
   */
  before(date: Date | string): TParent {
    const value = date instanceof Date ? date.toISOString() : date;
    this._addCondition({ field: this._field, operator: "before", value });
    return this._parent;
  }

  /**
   * Date after
   */
  after(date: Date | string): TParent {
    const value = date instanceof Date ? date.toISOString() : date;
    this._addCondition({ field: this._field, operator: "after", value });
    return this._parent;
  }
}

// =============================================================================
// CRITERIA BUILDER
// =============================================================================

/**
 * Type-safe criteria builder for complex queries.
 *
 * @example
 * ```typescript
 * const criteria = new Criteria<User>()
 *   .where("name").contains("john")
 *   .where("age").between(18, 65)
 *   .where("status").in(["active", "pending"])
 *   .and(
 *     new Criteria<User>()
 *       .where("role").eq("admin")
 *       .or()
 *       .where("level").gte(5)
 *   )
 *   .build();
 * ```
 */
export class Criteria<TEntity> {
  private _conditions: Array<CriteriaCondition | CriteriaGroup> = [];
  private _currentGroup: "and" | "or" = "and";

  /**
   * Start a condition for a field
   */
  where<K extends keyof TEntity>(
    field: K
  ): FieldCriteriaBuilder<TEntity, Criteria<TEntity>> {
    return new FieldCriteriaBuilder(
      field as string,
      this,
      (condition) => this._conditions.push(condition)
    );
  }

  /**
   * Add nested AND group
   */
  and(criteria: Criteria<TEntity>): this {
    const built = criteria.build();
    if (built.conditions.length > 0) {
      this._conditions.push({
        type: "and",
        conditions: built.conditions,
      });
    }
    return this;
  }

  /**
   * Switch to OR mode for next conditions
   */
  or(): this {
    this._currentGroup = "or";
    return this;
  }

  /**
   * Add nested OR group
   */
  orGroup(criteria: Criteria<TEntity>): this {
    const built = criteria.build();
    if (built.conditions.length > 0) {
      this._conditions.push({
        type: "or",
        conditions: built.conditions,
      });
    }
    return this;
  }

  /**
   * Build the criteria
   */
  build(): BuiltCriteria {
    return {
      conditions: [...this._conditions],
      toJSON: () => this._conditions,
    };
  }
}

// =============================================================================
// SORT BUILDER
// =============================================================================

export type SortDirection = "asc" | "desc";

export interface SortField {
  field: string;
  direction: SortDirection;
}

export interface BuiltSort {
  fields: SortField[];
  toJSON(): any;
}

/**
 * Sort builder for ordering results.
 *
 * @example
 * ```typescript
 * Sort.by("name").asc()
 * Sort.by("name").asc().and("createdAt").desc()
 * ```
 */
export class Sort {
  private _fields: SortField[] = [];
  private _currentField: string = "";

  private constructor() {}

  /**
   * Start sort with a field
   */
  static by(field: string, direction?: SortDirection): Sort {
    const sort = new Sort();
    sort._currentField = field;
    if (direction) {
      sort._fields.push({ field, direction });
      sort._currentField = "";
    }
    return sort;
  }

  /**
   * Sort ascending
   */
  asc(): Sort {
    if (this._currentField) {
      this._fields.push({ field: this._currentField, direction: "asc" });
      this._currentField = "";
    }
    return this;
  }

  /**
   * Sort descending
   */
  desc(): Sort {
    if (this._currentField) {
      this._fields.push({ field: this._currentField, direction: "desc" });
      this._currentField = "";
    }
    return this;
  }

  /**
   * Add another sort field
   */
  and(field: string, direction?: SortDirection): Sort {
    if (direction) {
      this._fields.push({ field, direction });
    } else {
      this._currentField = field;
    }
    return this;
  }

  /**
   * Build the sort
   */
  build(): BuiltSort {
    return {
      fields: [...this._fields],
      toJSON: () => this._fields,
    };
  }
}

// =============================================================================
// PAGEABLE
// =============================================================================

export interface PageableConfig {
  page: number;
  limit: number;
}

export interface BuiltPageable {
  page: number;
  limit: number;
  toJSON(): any;
}

/**
 * Pageable builder for pagination.
 *
 * @example
 * ```typescript
 * Pageable.of(0, 20)      // page 0, 20 items
 * Pageable.first(20)      // first page, 20 items
 * Pageable.unpaged()      // no pagination
 * ```
 */
export class Pageable {
  private _page: number;
  private _limit: number;
  private _unpaged: boolean = false;

  private constructor(page: number, limit: number) {
    this._page = page;
    this._limit = limit;
  }

  /**
   * Create pageable with page and limit
   */
  static of(page: number, limit: number): BuiltPageable {
    return new Pageable(page, limit).build();
  }

  /**
   * Create pageable for first page
   */
  static first(limit: number): BuiltPageable {
    return new Pageable(0, limit).build();
  }

  /**
   * Create unpaged (no pagination)
   */
  static unpaged(): BuiltPageable {
    const pageable = new Pageable(0, -1);
    pageable._unpaged = true;
    return pageable.build();
  }

  /**
   * Build the pageable
   */
  build(): BuiltPageable {
    return {
      page: this._page,
      limit: this._unpaged ? -1 : this._limit,
      toJSON: () =>
        this._unpaged
          ? { unpaged: true }
          : { page: this._page, limit: this._limit },
    };
  }
}
