/**
 * Mapper Page - DTO/Entity transformation
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicMapperCode = `import { Mapper } from "lumino/core";

// API DTO (what the API returns)
interface UserDTO {
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;  // Computed from API
}

// Entity (what your app uses)
class UserEntity {
  first_name: string = "";
  last_name: string = "";
  email_address: string = "";
}

// Mapper transforms between the two
class UserMapper extends Mapper<UserDTO, UserEntity> {
  constructor() {
    super("UserMapper");

    // Map firstName <-> first_name
    this.field()
      .dto("firstName")
      .entity("first_name")
    .end();

    // Map lastName <-> last_name
    this.field()
      .dto("lastName")
      .entity("last_name")
    .end();

    // Map email <-> email_address
    this.field()
      .dto("email")
      .entity("email_address")
    .end();

    // Computed DTO field (from entity)
    this.computed()
      .dto("fullName")
      .value((entity) => \`\${entity.first_name} \${entity.last_name}\`)
    .end();

    // Auto-registration happens automatically
  }
}

// Use with API
class UsersApi extends CrudApi<UserEntity> {
  constructor() {
    super();
    this.entity(UserEntity)
        .baseUrl("/api/users")
        .mapper(new UserMapper().build());
  }
}`;

const mapperSignatureCode = `class Mapper<TDto, TEntity> {
  constructor(name: string);

  // Field mapping (bidirectional)
  field(): FieldMappingBuilder<TDto, TEntity, this>;

  // Computed field (one direction)
  computed(): ComputedFieldBuilder<TDto, TEntity, this>;

  // Ignore fields
  ignore(...fields: string[]): this;

  // Build mapper
  build(): BuiltMapper<TDto, TEntity>;
}

interface BuiltMapper<TDto, TEntity> {
  name: string;
  toDTO(entity: TEntity): TDto;
  toEntity(dto: TDto): TEntity;
  toDTOList(entities: TEntity[]): TDto[];
  toEntityList(dtos: TDto[]): TEntity[];
}`;

const fieldMappingCode = `class ProductMapper extends Mapper<ProductDTO, ProductEntity> {
  constructor() {
    super("ProductMapper");

    // Simple field mapping
    this.field()
      .dto("productName")       // DTO field name
      .entity("product_name")   // Entity field name
    .end();

    // Field mapping with transformation
    this.field()
      .dto("price")
      .entity("price_cents")
      .toDTO((cents) => cents / 100)           // Entity -> DTO
      .toEntity((dollars) => dollars * 100)    // DTO -> Entity
    .end();

    // Date transformation
    this.field()
      .dto("createdAt")
      .entity("created_at")
      .toDTO((timestamp) => new Date(timestamp))
      .toEntity((date) => date.toISOString())
    .end();
  }
}`;

const computedFieldsCode = `class EmployeeMapper extends Mapper<EmployeeDTO, EmployeeEntity> {
  constructor() {
    super("EmployeeMapper");

    // Computed DTO field (from entity)
    this.computed()
      .dto("fullName")
      .value((entity) => \`\${entity.first_name} \${entity.last_name}\`)
    .end();

    // Computed DTO field with complex logic
    this.computed()
      .dto("displayStatus")
      .value((entity) => {
        if (!entity.is_active) return "Inactive";
        if (entity.on_leave) return "On Leave";
        return "Active";
      })
    .end();

    // Computed Entity field (from DTO)
    this.computed()
      .entity("search_text")
      .value((dto) => {
        return [dto.firstName, dto.lastName, dto.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
      })
    .end();
  }
}`;

const ignoreFieldsCode = `class UserMapper extends Mapper<UserDTO, UserEntity> {
  constructor() {
    super("UserMapper");

    // Regular field mappings...
    this.field()
      .dto("email")
      .entity("email_address")
    .end();

    // Ignore sensitive fields (won't be mapped)
    this.ignore("password", "token", "refreshToken");

    // These fields are never included in toDTO or toEntity
  }
}`;

const transformationsCode = `class OrderMapper extends Mapper<OrderDTO, OrderEntity> {
  constructor() {
    super("OrderMapper");

    // String transformations
    this.field()
      .dto("customerName")
      .entity("customer_name")
      .toDTO((value) => value.toUpperCase())
      .toEntity((value) => value.toLowerCase())
    .end();

    // Number transformations
    this.field()
      .dto("total")
      .entity("total_cents")
      .toDTO((cents) => Number((cents / 100).toFixed(2)))
      .toEntity((dollars) => Math.round(dollars * 100))
    .end();

    // Boolean transformations
    this.field()
      .dto("isPaid")
      .entity("payment_status")
      .toDTO((status) => status === "paid")
      .toEntity((isPaid) => isPaid ? "paid" : "pending")
    .end();

    // Array transformations
    this.field()
      .dto("tags")
      .entity("tag_string")
      .toDTO((tagString) => tagString.split(","))
      .toEntity((tags) => tags.join(","))
    .end();

    // Nested object transformations
    this.field()
      .dto("shippingAddress")
      .entity("shipping_address_json")
      .toDTO((json) => JSON.parse(json))
      .toEntity((obj) => JSON.stringify(obj))
    .end();
  }
}`;

const autoMappingCode = `// Fields with the same name in DTO and Entity are auto-mapped
class SimpleMapper extends Mapper<SimpleDTO, SimpleEntity> {
  constructor() {
    super("SimpleMapper");

    // These fields have the same name, so they're auto-mapped:
    // - id
    // - name
    // - description

    // Only specify mappings for different names
    this.field()
      .dto("createdAt")
      .entity("created_at")
    .end();
  }
}

// Example:
// DTO:    { id: 1, name: "Product", description: "Desc", createdAt: "2024-01-01" }
// Entity: { id: 1, name: "Product", description: "Desc", created_at: "2024-01-01" }`;

const bidirectionalCode = `class UserMapper extends Mapper<UserDTO, UserEntity> {
  constructor() {
    super("UserMapper");

    this.field()
      .dto("firstName")
      .entity("first_name")
      .toDTO((value) => value.toUpperCase())    // Entity -> DTO
      .toEntity((value) => value.toLowerCase())  // DTO -> Entity
    .end();
  }
}

// Usage:
const mapper = new UserMapper().build();

// Entity to DTO
const entity = { first_name: "john" };
const dto = mapper.toDTO(entity);
// { firstName: "JOHN" }

// DTO to Entity
const dto2 = { firstName: "JANE" };
const entity2 = mapper.toEntity(dto2);
// { first_name: "jane" }`;

const arrayMappingCode = `const mapper = new UserMapper().build();

// Single entity
const dto = mapper.toDTO(entity);
const entity = mapper.toEntity(dto);

// Array of entities
const entities = [entity1, entity2, entity3];
const dtos = mapper.toDTOList(entities);

// Array of DTOs
const dtos = [dto1, dto2, dto3];
const entities = mapper.toEntityList(dtos);`;

const withApiCode = `// Mapper is used automatically by APIs
class UsersApi extends CrudApi<User> {
  constructor() {
    super();
    this.entity(User)
        .baseUrl("/api/users")
        .mapper(new UserMapper().build());
  }
}

// On requests (create/update/patch):
// Your entity -> Mapper.toEntity() -> API request body

// On responses (list/get/search):
// API response -> Mapper.toDTO() -> Your entity`;

const completeExampleCode = `import { Mapper } from "lumino/core";

// 1. Define DTO (API format)
interface ProductDTO {
  productName: string;
  price: number;
  inStock: boolean;
  category: string;
  createdAt: Date;
  displayName: string;  // Computed
}

// 2. Define Entity (app format)
class ProductEntity {
  product_name: string = "";
  price_cents: number = 0;
  in_stock: boolean = true;
  category_id: string = "";
  created_at: string = "";
}

// 3. Define Mapper
class ProductMapper extends Mapper<ProductDTO, ProductEntity> {
  constructor() {
    super("ProductMapper");

    // Field mappings
    this.field()
      .dto("productName")
      .entity("product_name")
    .end();

    this.field()
      .dto("price")
      .entity("price_cents")
      .toDTO((cents) => cents / 100)
      .toEntity((dollars) => dollars * 100)
    .end();

    this.field()
      .dto("inStock")
      .entity("in_stock")
    .end();

    this.field()
      .dto("category")
      .entity("category_id")
    .end();

    this.field()
      .dto("createdAt")
      .entity("created_at")
      .toDTO((timestamp) => new Date(timestamp))
      .toEntity((date) => date.toISOString())
    .end();

    // Computed fields
    this.computed()
      .dto("displayName")
      .value((entity) => {
        const status = entity.in_stock ? "In Stock" : "Out of Stock";
        return \`\${entity.product_name} - \${status}\`;
      })
    .end();
  }
}

// 4. Use with API
class ProductsApi extends CrudApi<ProductEntity> {
  constructor() {
    super();
    this.entity(ProductEntity)
        .baseUrl("/api/products")
        .mapper(new ProductMapper().build());
  }
}`;

const methodsTableData = [
  { method: "field()", description: "Start bidirectional field mapping builder" },
  { method: ".dto(field)", description: "Set DTO field name" },
  { method: ".entity(field)", description: "Set Entity field name" },
  { method: ".toDTO(fn)", description: "Transform entity value to DTO value" },
  { method: ".toEntity(fn)", description: "Transform DTO value to entity value" },
  { method: ".end()", description: "Complete field mapping" },
  { method: "computed()", description: "Start computed field builder" },
  { method: ".dto(field)", description: "Set computed DTO field" },
  { method: ".entity(field)", description: "Set computed Entity field" },
  { method: ".value(fn)", description: "Compute value from source" },
  { method: "ignore(...fields)", description: "Ignore fields during mapping" },
  { method: "build()", description: "Build and return the mapper" },
];

export function MapperPage() {
  return (
    <>
      <h1 className="docs-page-title">Mapper</h1>
      <p className="docs-page-subtitle">
        Bidirectional DTO/Entity transformation with field mapping and computed values.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>Mapper&lt;TDto, TEntity&gt;</code> class transforms data between
          your API format (DTO) and your application format (Entity). This keeps your
          API contract separate from your internal data model.
        </p>
        <p>
          Mappers support field renaming, value transformations, computed fields, and
          automatic registration in the MapperRegistry.
        </p>
        <CodeBlock code={basicMapperCode} language="typescript" />
      </div>

      {/* Class Signature */}
      <div className="docs-section">
        <h2 className="docs-section-title">Class Signature</h2>
        <CodeBlock code={mapperSignatureCode} language="typescript" />
      </div>

      {/* Field Mapping */}
      <div className="docs-section">
        <h2 className="docs-section-title">Field Mapping</h2>
        <p>
          Map fields between DTO and Entity with optional transformations:
        </p>
        <CodeBlock code={fieldMappingCode} language="typescript" />
      </div>

      {/* Computed Fields */}
      <div className="docs-section">
        <h2 className="docs-section-title">Computed Fields</h2>
        <p>
          Create fields that are computed from other fields:
        </p>
        <CodeBlock code={computedFieldsCode} language="typescript" />
      </div>

      {/* Ignore Fields */}
      <div className="docs-section">
        <h2 className="docs-section-title">Ignoring Fields</h2>
        <p>
          Exclude sensitive or unnecessary fields from mapping:
        </p>
        <CodeBlock code={ignoreFieldsCode} language="typescript" />
      </div>

      {/* Transformations */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Transformations</h2>
        <p>
          Examples of common field transformations:
        </p>
        <CodeBlock code={transformationsCode} language="typescript" />
      </div>

      {/* Auto-mapping */}
      <div className="docs-section">
        <h2 className="docs-section-title">Auto-mapping</h2>
        <p>
          Fields with the same name in DTO and Entity are automatically mapped:
        </p>
        <CodeBlock code={autoMappingCode} language="typescript" />
      </div>

      {/* Bidirectional */}
      <div className="docs-section">
        <h2 className="docs-section-title">Bidirectional Mapping</h2>
        <p>
          Mappers work in both directions - DTO to Entity and Entity to DTO:
        </p>
        <CodeBlock code={bidirectionalCode} language="typescript" />
      </div>

      {/* Array Mapping */}
      <div className="docs-section">
        <h2 className="docs-section-title">Array Mapping</h2>
        <p>
          Built-in support for mapping arrays:
        </p>
        <CodeBlock code={arrayMappingCode} language="typescript" />
      </div>

      {/* With API */}
      <div className="docs-section">
        <h2 className="docs-section-title">Integration with APIs</h2>
        <p>
          Mappers are automatically used by APIs when configured:
        </p>
        <CodeBlock code={withApiCode} language="typescript" />
      </div>

      {/* Complete Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <p>
          Here's a complete example with DTO, Entity, Mapper, and API:
        </p>
        <CodeBlock code={completeExampleCode} language="typescript" />
      </div>

      {/* Methods Reference */}
      <div className="docs-section">
        <h2 className="docs-section-title">Methods Reference</h2>
        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {methodsTableData.map((row, idx) => (
                <tr key={idx}>
                  <td><code>{row.method}</code></td>
                  <td>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>Always use mappers to keep API format separate from entity format</li>
          <li>Name your mapper after the entity (e.g., UserMapper, ProductMapper)</li>
          <li>Use computed fields for derived data that should only exist in DTOs</li>
          <li>Use transformations for data type conversions (cents to dollars, etc.)</li>
          <li>Ignore sensitive fields like passwords and tokens</li>
          <li>Map snake_case API fields to camelCase entity fields</li>
          <li>Use bidirectional transformations when data formats differ</li>
          <li>Test mappers separately from APIs for reliability</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>ApiRegistry</strong> - How mappers and APIs are registered</li>
          <li><strong>CrudApi</strong> - Using mappers with auto-generated CRUD operations</li>
          <li><strong>LookupApi</strong> - Using mappers with cached reference data</li>
        </ul>
      </div>
    </>
  );
}
