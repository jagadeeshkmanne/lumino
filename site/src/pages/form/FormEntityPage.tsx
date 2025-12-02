/**
 * Form Entity Binding Page - How forms bind to data models
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoCheckbox,
} from "lumino/react";

// =============================================================================
// ENTITY BINDING DEMO
// =============================================================================

interface ProductData {
  name: string;
  sku: string;
  price: number | null;
  quantity: number | null;
  category: string;
  isActive: boolean;
}

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food & Beverages" },
  { value: "home", label: "Home & Garden" },
];

class ProductForm extends Form<ProductData> {
  constructor() {
    super("product-form");
  }

  configure() {
    this.addSection("Product Details")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Product Name")
          .placeholder("Enter product name")
          .rules(Validators.required({ message: "Product name is required" }))
        .endField()
        .addField("sku")
          .component(LuminoTextInput)
          .label("SKU")
          .placeholder("ABC-12345")
          .rules(Validators.required({ message: "SKU is required" }))
        .endField()
        .layout([2, 1])
      .endRow()
      .addRow()
        .addField("category")
          .component(LuminoSelect)
          .label("Category")
          .placeholder("Select category")
          .props({ options: categories })
          .rules(Validators.required({ message: "Category is required" }))
        .endField()
        .addField("isActive")
          .component(LuminoCheckbox)
          .label("Active Product")
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    this.addSection("Pricing & Inventory")
      .addRow()
        .addField("price")
          .component(LuminoNumberInput)
          .label("Price ($)")
          .placeholder("0.00")
          .props({ min: 0, step: 0.01 })
          .rules(Validators.required({ message: "Price is required" }))
        .endField()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity in Stock")
          .placeholder("0")
          .props({ min: 0 })
          .rules(Validators.required({ message: "Quantity is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const entityFormCode = `import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoCheckbox,
} from "lumino/react";

// Entity interface defines the data shape
interface ProductData {
  name: string;
  sku: string;
  price: number | null;
  quantity: number | null;
  category: string;
  isActive: boolean;
}

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food & Beverages" },
  { value: "home", label: "Home & Garden" },
];

// Form bound to ProductData via generic
class ProductForm extends Form<ProductData> {
  constructor() {
    super("product-form");
  }

  configure() {
    this.addSection("Product Details")
      .addRow()
        .addField("name")  // Type-checked against ProductData
          .component(LuminoTextInput)
          .label("Product Name")
          .placeholder("Enter product name")
          .rules(Validators.required())
        .endField()
        .addField("sku")
          .component(LuminoTextInput)
          .label("SKU")
          .placeholder("ABC-12345")
          .rules(Validators.required())
        .endField()
        .layout([2, 1])
      .endRow()
      .addRow()
        .addField("category")
          .component(LuminoSelect)
          .label("Category")
          .props({ options: categories })
          .rules(Validators.required())
        .endField()
        .addField("isActive")
          .component(LuminoCheckbox)
          .label("Active Product")
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    this.addSection("Pricing & Inventory")
      .addRow()
        .addField("price")
          .component(LuminoNumberInput)
          .label("Price ($)")
          .props({ min: 0, step: 0.01 })
          .rules(Validators.required())
        .endField()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity in Stock")
          .props({ min: 0 })
          .rules(Validators.required())
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

const entityClassCode = `// Entity as interface
interface User {
  id: number;
  name: string;
  email: string;
}

// Entity as class (with defaults)
class User {
  id?: number;
  name = "";
  email = "";
  isActive = true;
  createdAt = new Date();
}

// Form generic matches entity type
class UserForm extends Form<User> {
  // Field names are type-checked against User
}`;

const typeSafetyCode = `interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

class EmployeeForm extends Form<Employee> {
  configure() {
    this.addRow()
      .addField("firstName")  // ✓ Valid - exists on Employee
        .component(LuminoTextInput)
        .label("First Name")
      .endField()
      .addField("middleName")  // ✗ Error - doesn't exist on Employee
        .component(LuminoTextInput)
        .label("Middle Name")
      .endField()
    .endRow();
  }
}`;

const formRendererCode = `// Create form instance
const form = new ProductForm();

// Initial entity data (from API, local state, etc.)
const product = {
  name: "Laptop",
  sku: "LAP-001",
  price: 999.99,
  quantity: 50,
  category: "electronics",
  isActive: true,
};

// Render with FormRenderer
<FormRenderer
  form={form}
  initialValues={product}
  onChange={(values) => console.log("Changed:", values)}
  onSubmit={(values) => saveProduct(values)}
/>`;

const nestedEntityCode = `// Nested entity structure
interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  shipping: Address;
}

// Access nested fields with dot notation
this.addField("customer.name")
  .component(LuminoTextInput)
  .label("Customer Name")
.endField();

this.addField("shipping.street")
  .component(LuminoTextInput)
  .label("Shipping Street")
.endField();`;

const entityWithMethodsCode = `// Entity class with computed properties and methods
class Invoice {
  items: InvoiceItem[] = [];
  taxRate = 0.1;

  // Computed property
  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  get tax(): number {
    return this.subtotal * this.taxRate;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  // Methods
  addItem(item: InvoiceItem) {
    this.items.push(item);
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }
}

// Form can access computed values via ctx.entity
this.addRow()
  .addComponent(LuminoText)
    .text((ctx) => \`Total: $\${ctx.entity?.total?.toFixed(2)}\`)
  .endComponent()
.endRow();`;

export function FormEntityPage() {
  const form = new ProductForm();

  return (
    <>
      <h1 className="docs-page-title">Entity Binding</h1>
      <p className="docs-page-subtitle">
        How Lumino forms bind to your TypeScript data models.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          Lumino forms are strongly typed via TypeScript generics. When you create a
          <code>Form&lt;T&gt;</code>, the <code>T</code> parameter defines the data shape,
          and all field names are type-checked against it.
        </p>
        <p>
          Entities can be defined as interfaces (for type-only) or classes (for defaults
          and methods). The form doesn't care - it just needs the type information.
        </p>
      </div>

      {/* Live Demo */}
      <div className="docs-section">
        <h2 className="docs-section-title">Live Example</h2>
        <p>
          This product form demonstrates entity binding with various field types.
          Notice how the field names match the <code>ProductData</code> interface:
        </p>
        <LuminoLiveDemo
          title="Product Form"
          description="Form bound to ProductData entity"
          form={form}
          code={entityFormCode}
          initialValues={{
            name: "",
            sku: "",
            price: null,
            quantity: null,
            category: "",
            isActive: true,
          }}
          defaultView="split"
        />
      </div>

      {/* Entity Definition */}
      <div className="docs-section">
        <h2 className="docs-section-title">Defining Entities</h2>
        <p>
          Entities can be interfaces or classes. Classes are useful when you need
          default values or methods:
        </p>
        <CodeBlock code={entityClassCode} language="typescript" />
      </div>

      {/* Type Safety */}
      <div className="docs-section">
        <h2 className="docs-section-title">Type Safety</h2>
        <p>
          Field names in <code>.addField()</code> are type-checked. TypeScript will
          error if you use a field name that doesn't exist on the entity:
        </p>
        <CodeBlock code={typeSafetyCode} language="typescript" />
        <p>
          This catches typos and refactoring errors at compile time, not runtime.
        </p>
      </div>

      {/* Using FormRenderer */}
      <div className="docs-section">
        <h2 className="docs-section-title">Rendering with Data</h2>
        <p>
          Pass entity data to <code>FormRenderer</code> via <code>initialValues</code>:
        </p>
        <CodeBlock code={formRendererCode} language="typescript" />
      </div>

      {/* Nested Entities */}
      <div className="docs-section">
        <h2 className="docs-section-title">Nested Entities</h2>
        <p>
          Access nested properties using dot notation:
        </p>
        <CodeBlock code={nestedEntityCode} language="typescript" />
      </div>

      {/* Entities with Methods */}
      <div className="docs-section">
        <h2 className="docs-section-title">Entity Classes with Methods</h2>
        <p>
          Entity classes can have computed properties and methods that are accessible
          via the form context:
        </p>
        <CodeBlock code={entityWithMethodsCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>
            <strong>Use classes for mutable entities</strong> - When you need defaults,
            computed values, or methods
          </li>
          <li>
            <strong>Use interfaces for API responses</strong> - When data comes from
            external sources without custom logic
          </li>
          <li>
            <strong>Initialize nullable fields properly</strong> - Use <code>null</code>
            for optional numbers/dates, empty strings for text
          </li>
          <li>
            <strong>Keep entities flat when possible</strong> - Deep nesting adds
            complexity; flatten when reasonable
          </li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>FormContext</strong> - Accessing entity and form state</li>
          <li><strong>FormRenderer</strong> - Rendering forms with React</li>
          <li><strong>Validation</strong> - Adding validation rules</li>
        </ul>
      </div>
    </>
  );
}
