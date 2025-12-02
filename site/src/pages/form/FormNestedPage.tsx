/**
 * Form Nested Objects Documentation
 *
 * Documents how to handle nested object fields with mini demos.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoCheckbox,
  FormRenderer,
} from "lumino/react";
import { LiveDemo } from "../../components/LiveDemo";

// =============================================================================
// DEMO DATA
// =============================================================================

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
];

const addressTypes = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "billing", label: "Billing" },
];

// =============================================================================
// DEMO ENTITIES
// =============================================================================

class Address {
  street = "";
  city = "";
  state = "";
  zipCode = "";
  country = "";
}

class ContactInfo {
  email = "";
  phone = "";
  fax = "";
}

class PersonWithAddress {
  firstName = "";
  lastName = "";
  address = new Address();
}

class PersonWithMultipleAddresses {
  name = "";
  homeAddress = new Address();
  workAddress = new Address();
  sameAsHome = false;
}

class CompanyEntity {
  name = "";
  contact = new ContactInfo();
  billingAddress = new Address();
  shippingAddress = new Address();
}

// =============================================================================
// DEMO 1: Basic Nested Object
// =============================================================================

class BasicNestedForm extends Form<PersonWithAddress> {
  constructor() {
    super("basic-nested");
  }

  configure() {
    this.addSection("Person Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("Enter first name")
          .rules(Validators.required({ message: "First name is required" }))
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter last name")
          .rules(Validators.required({ message: "Last name is required" }))
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // Nested object - fields become address.street, address.city, etc.
    this.addSection("Address")
      .addRow()
        .addField("address.street")
          .component(LuminoTextInput)
          .label("Street Address")
          .placeholder("Enter street address")
          .endField()
      .endRow()
      .addRow()
        .addField("address.city")
          .component(LuminoTextInput)
          .label("City")
          .placeholder("Enter city")
          .endField()
        .addField("address.state")
          .component(LuminoTextInput)
          .label("State")
          .placeholder("Enter state")
          .endField()
        .addField("address.zipCode")
          .component(LuminoTextInput)
          .label("ZIP Code")
          .placeholder("Enter ZIP")
          .endField()
        .layout([2, 1, 1])
      .endRow()
      .addRow()
        .addField("address.country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select country")
          .props({ options: countries })
          .endField()
      .endRow()
    .endSection();
  }
}

const basicNestedCode = `class PersonWithAddress {
  firstName = "";
  lastName = "";
  address = new Address();  // Nested object
}

class Address {
  street = "";
  city = "";
  state = "";
  zipCode = "";
  country = "";
}

class BasicNestedForm extends Form<PersonWithAddress> {
  configure() {
    this.addSection("Person Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // Nested object fields use dot notation
    this.addSection("Address")
      .addRow()
        .addField("address.street")      // address.street
          .component(LuminoTextInput)
          .label("Street Address")
          .endField()
      .endRow()
      .addRow()
        .addField("address.city")        // address.city
          .component(LuminoTextInput)
          .label("City")
          .endField()
        .addField("address.state")       // address.state
          .component(LuminoTextInput)
          .label("State")
          .endField()
        .addField("address.zipCode")     // address.zipCode
          .component(LuminoTextInput)
          .label("ZIP Code")
          .endField()
        .layout([2, 1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 2: Multiple Nested Objects
// =============================================================================

class MultipleNestedForm extends Form<PersonWithMultipleAddresses> {
  constructor() {
    super("multiple-nested");
  }

  configure() {
    this.addSection("Person")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Full Name")
          .placeholder("Enter full name")
          .endField()
      .endRow()
    .endSection();

    this.addSection("Home Address")
      .addRow()
        .addField("homeAddress.street")
          .component(LuminoTextInput)
          .label("Street")
          .placeholder("Home street address")
          .endField()
      .endRow()
      .addRow()
        .addField("homeAddress.city")
          .component(LuminoTextInput)
          .label("City")
          .endField()
        .addField("homeAddress.state")
          .component(LuminoTextInput)
          .label("State")
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    this.addSection("Work Address")
      .addRow()
        .addField("sameAsHome")
          .component(LuminoCheckbox)
          .label("Same as home address")
          .endField()
      .endRow()
      .addRow()
        .addField("workAddress.street")
          .component(LuminoTextInput)
          .label("Street")
          .placeholder("Work street address")
          .disable((ctx) => ctx.getValue("sameAsHome"))
          .dependsOn("sameAsHome", {
            handler: (sameAsHome, ctx) => {
              if (sameAsHome) {
                ctx.setValue("workAddress.street", ctx.getValue("homeAddress.street"));
                ctx.setValue("workAddress.city", ctx.getValue("homeAddress.city"));
                ctx.setValue("workAddress.state", ctx.getValue("homeAddress.state"));
              }
            }
          })
          .endField()
      .endRow()
      .addRow()
        .addField("workAddress.city")
          .component(LuminoTextInput)
          .label("City")
          .disable((ctx) => ctx.getValue("sameAsHome"))
          .endField()
        .addField("workAddress.state")
          .component(LuminoTextInput)
          .label("State")
          .disable((ctx) => ctx.getValue("sameAsHome"))
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const multipleNestedCode = `class PersonWithMultipleAddresses {
  name = "";
  homeAddress = new Address();
  workAddress = new Address();
  sameAsHome = false;
}

class MultipleNestedForm extends Form<PersonWithMultipleAddresses> {
  configure() {
    this.addSection("Person")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Full Name")
          .endField()
      .endRow()
    .endSection();

    this.addSection("Home Address")
      .addRow()
        .addField("homeAddress.street")
          .component(LuminoTextInput)
          .label("Street")
          .endField()
      .endRow()
      // ... more home address fields
    .endSection();

    this.addSection("Work Address")
      .addRow()
        .addField("sameAsHome")
          .component(LuminoCheckbox)
          .label("Same as home address")
          .endField()
      .endRow()
      .addRow()
        .addField("workAddress.street")
          .component(LuminoTextInput)
          .label("Street")
          // Disable when same as home
          .disable((ctx) => ctx.getValue("sameAsHome"))
          // Copy values when checkbox is checked
          .dependsOn("sameAsHome", {
            handler: (sameAsHome, ctx) => {
              if (sameAsHome) {
                ctx.setValue("workAddress.street",
                  ctx.getValue("homeAddress.street"));
                ctx.setValue("workAddress.city",
                  ctx.getValue("homeAddress.city"));
                // ... copy other fields
              }
            }
          })
          .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 3: Deeply Nested Objects
// =============================================================================

class DeepEntity {
  level1 = {
    name: "",
    level2: {
      description: "",
      level3: {
        value: 0,
      },
    },
  };
}

class DeepNestedForm extends Form<DeepEntity> {
  constructor() {
    super("deep-nested");
  }

  configure() {
    this.addSection("Deeply Nested Example")
      .addRow()
        .addField("level1.name")
          .component(LuminoTextInput)
          .label("Level 1 - Name")
          .placeholder("First level property")
          .endField()
      .endRow()
      .addRow()
        .addField("level1.level2.description")
          .component(LuminoTextInput)
          .label("Level 2 - Description")
          .placeholder("Second level property")
          .endField()
      .endRow()
      .addRow()
        .addField("level1.level2.level3.value")
          .component(LuminoNumberInput)
          .label("Level 3 - Value")
          .placeholder("Third level property")
          .endField()
      .endRow()
    .endSection();
  }
}

const deepNestedCode = `class DeepEntity {
  level1 = {
    name: "",
    level2: {
      description: "",
      level3: {
        value: 0,
      },
    },
  };
}

class DeepNestedForm extends Form<DeepEntity> {
  configure() {
    this.addSection("Deeply Nested Example")
      .addRow()
        .addField("level1.name")           // 1 level deep
          .component(LuminoTextInput)
          .label("Level 1 - Name")
          .endField()
      .endRow()
      .addRow()
        .addField("level1.level2.description")  // 2 levels deep
          .component(LuminoTextInput)
          .label("Level 2 - Description")
          .endField()
      .endRow()
      .addRow()
        .addField("level1.level2.level3.value")  // 3 levels deep
          .component(LuminoNumberInput)
          .label("Level 3 - Value")
          .endField()
      .endRow()
    .endSection();
  }
}

// Data structure:
// {
//   level1: {
//     name: "...",
//     level2: {
//       description: "...",
//       level3: {
//         value: 123
//       }
//     }
//   }
// }`;

// =============================================================================
// DEMO 4: Complex Business Entity
// =============================================================================

class CompanyForm extends Form<CompanyEntity> {
  constructor() {
    super("company-form");
  }

  configure() {
    this.addSection("Company Information")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Company Name")
          .placeholder("Enter company name")
          .rules(Validators.required({ message: "Company name is required" }))
          .endField()
      .endRow()
    .endSection();

    this.addSection("Contact Information")
      .addRow()
        .addField("contact.email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("company@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Invalid email format")
          )
          .endField()
        .addField("contact.phone")
          .component(LuminoTextInput)
          .label("Phone")
          .placeholder("+1 (555) 123-4567")
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    this.addSection("Billing Address")
      .addRow()
        .addField("billingAddress.street")
          .component(LuminoTextInput)
          .label("Street")
          .endField()
      .endRow()
      .addRow()
        .addField("billingAddress.city")
          .component(LuminoTextInput)
          .label("City")
          .endField()
        .addField("billingAddress.state")
          .component(LuminoTextInput)
          .label("State")
          .endField()
        .addField("billingAddress.zipCode")
          .component(LuminoTextInput)
          .label("ZIP")
          .endField()
        .layout([2, 1, 1])
      .endRow()
    .endSection();

    this.addSection("Shipping Address")
      .addRow()
        .addField("shippingAddress.street")
          .component(LuminoTextInput)
          .label("Street")
          .endField()
      .endRow()
      .addRow()
        .addField("shippingAddress.city")
          .component(LuminoTextInput)
          .label("City")
          .endField()
        .addField("shippingAddress.state")
          .component(LuminoTextInput)
          .label("State")
          .endField()
        .addField("shippingAddress.zipCode")
          .component(LuminoTextInput)
          .label("ZIP")
          .endField()
        .layout([2, 1, 1])
      .endRow()
    .endSection();
  }
}

const companyFormCode = `class CompanyEntity {
  name = "";
  contact = new ContactInfo();      // Nested
  billingAddress = new Address();   // Nested
  shippingAddress = new Address();  // Nested
}

class CompanyForm extends Form<CompanyEntity> {
  configure() {
    this.addSection("Company Information")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Company Name")
          .rules(Validators.required())
          .endField()
      .endRow()
    .endSection();

    this.addSection("Contact Information")
      .addRow()
        .addField("contact.email")       // contact.email
          .component(LuminoTextInput)
          .label("Email")
          .rules(Validators.required(), Validators.email())
          .endField()
        .addField("contact.phone")       // contact.phone
          .component(LuminoTextInput)
          .label("Phone")
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    this.addSection("Billing Address")
      .addRow()
        .addField("billingAddress.street")   // billingAddress.street
          .component(LuminoTextInput)
          .label("Street")
          .endField()
      .endRow()
      // ... more billing fields
    .endSection();

    this.addSection("Shipping Address")
      .addRow()
        .addField("shippingAddress.street")  // shippingAddress.street
          .component(LuminoTextInput)
          .label("Street")
          .endField()
      .endRow()
      // ... more shipping fields
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function FormNestedPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Nested Objects</h1>
      <p className="docs-page-subtitle">
        Learn how to bind form fields to nested object properties using dot notation.
        This enables working with complex data structures while maintaining a flat form definition.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        Nested objects use dot notation (e.g., <code>address.street</code>) for field binding.
      </div>

      <div className="docs-section">
        <h2>How Nested Objects Work</h2>
        <p>
          Lumino supports nested object binding using dot notation in field names:
        </p>
        <pre className="docs-code">{`// Entity with nested object
class Person {
  name = "";
  address = {
    street: "",
    city: "",
  };
}

// Form definition
.addField("name")           // Binds to person.name
  .component(LuminoTextInput)
  .endField()

.addField("address.street") // Binds to person.address.street
  .component(LuminoTextInput)
  .endField()

.addField("address.city")   // Binds to person.address.city
  .component(LuminoTextInput)
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>1. Basic Nested Object</h2>
        <p>
          A simple example with a person entity that has a nested address object.
          Notice how fields use dot notation like <code>address.street</code>.
        </p>
        <LiveDemo
          title="Basic Nested Object"
          description="Person with nested Address object"
          code={basicNestedCode}
          FormClass={BasicNestedForm}
          EntityClass={PersonWithAddress}
        />
      </div>

      <div className="docs-section">
        <h2>2. Multiple Nested Objects</h2>
        <p>
          An entity can have multiple nested objects. This example shows home and work
          addresses with a "same as home" checkbox that copies values.
        </p>
        <LiveDemo
          title="Multiple Nested Objects"
          description="Person with home and work addresses"
          code={multipleNestedCode}
          FormClass={MultipleNestedForm}
          EntityClass={PersonWithMultipleAddresses}
        />
      </div>

      <div className="docs-section">
        <h2>3. Deeply Nested Objects</h2>
        <p>
          You can nest objects to any depth using dot notation. Each dot represents
          one level of nesting.
        </p>
        <LiveDemo
          title="Deep Nesting"
          description="Three levels of nesting"
          code={deepNestedCode}
          FormClass={DeepNestedForm}
          EntityClass={DeepEntity}
        />
      </div>

      <div className="docs-section">
        <h2>4. Real-World Example: Company Form</h2>
        <p>
          A realistic business entity with contact information and multiple addresses.
          This pattern is common in enterprise applications.
        </p>
        <LiveDemo
          title="Company Form"
          description="Complex entity with multiple nested objects"
          code={companyFormCode}
          FormClass={CompanyForm}
          EntityClass={CompanyEntity}
        />
      </div>

      <div className="docs-section">
        <h2>Working with Nested Data in Context</h2>
        <pre className="docs-code">{`// Getting nested values
const street = ctx.getValue("address.street");
const city = ctx.getValue("address.city");

// Setting nested values
ctx.setValue("address.street", "123 Main St");
ctx.setValue("address.city", "New York");

// In dependencies
.dependsOn("address.country", {
  handler: (country, ctx) => {
    // Clear state when country changes
    ctx.setValue("address.state", "");
  }
})

// In visibility conditions
.hideByCondition((ctx) =>
  ctx.getValue("address.country") !== "us"
)

// Validation on nested fields
.addField("address.zipCode")
  .rules(
    Validators.required({ message: "ZIP is required" }),
    Validators.pattern(/^\\d{5}$/, "Must be 5 digits")
  )
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Initialize nested objects</strong> in your entity class to avoid
            null reference errors
          </li>
          <li>
            <strong>Use consistent naming</strong> - dot notation should match your
            entity structure exactly
          </li>
          <li>
            <strong>Group related fields</strong> in sections that match the object
            structure for better UX
          </li>
          <li>
            <strong>Consider using Lists</strong> when you have arrays of nested objects
            (see Lists documentation)
          </li>
          <li>
            <strong>Validate nested fields</strong> the same way as top-level fields -
            validation works with dot notation
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Nested Objects vs Lists</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Nested Objects</th>
              <th>Lists</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Use Case</td>
              <td>Fixed structure (e.g., billingAddress)</td>
              <td>Dynamic collections (e.g., addresses[])</td>
            </tr>
            <tr>
              <td>Field Binding</td>
              <td><code>address.street</code></td>
              <td><code>addresses[0].street</code></td>
            </tr>
            <tr>
              <td>Add/Remove</td>
              <td>Not applicable</td>
              <td>Supported via list operations</td>
            </tr>
            <tr>
              <td>Display Options</td>
              <td>Inline in sections</td>
              <td>Tabs, Rows, Table, Dialog</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
