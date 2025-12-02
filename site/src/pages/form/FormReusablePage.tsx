/**
 * Form Reusable Sections Documentation
 *
 * Documents how to create and include reusable field configurations.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { Form, Validators } from "lumino/core";
import type { FormContext } from "lumino/core";
import {
  LuminoTextInput,
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
  { value: "shipping", label: "Shipping" },
];

// =============================================================================
// REUSABLE FIELD COMPONENTS
// =============================================================================

// This is a reusable address fields component
class AddressFields {
  static configure(form: any, prefix: string = "") {
    const p = prefix ? `${prefix}.` : "";

    form.addRow()
      .addField(`${p}street`)
        .component(LuminoTextInput)
        .label("Street Address")
        .placeholder("Enter street address")
        .rules(Validators.required({ message: "Street is required" }))
        .endField()
    .endRow();

    form.addRow()
      .addField(`${p}city`)
        .component(LuminoTextInput)
        .label("City")
        .placeholder("Enter city")
        .rules(Validators.required({ message: "City is required" }))
        .endField()
      .addField(`${p}state`)
        .component(LuminoTextInput)
        .label("State")
        .placeholder("Enter state")
        .endField()
      .addField(`${p}zipCode`)
        .component(LuminoTextInput)
        .label("ZIP Code")
        .placeholder("Enter ZIP")
        .endField()
      .layout([2, 1, 1])
    .endRow();

    form.addRow()
      .addField(`${p}country`)
        .component(LuminoSelect)
        .label("Country")
        .placeholder("Select country")
        .props({ options: countries })
        .endField()
    .endRow();
  }
}

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

class PersonWithAddresses {
  firstName = "";
  lastName = "";
  homeAddress = new Address();
  workAddress = new Address();
  useHomeAsWork = false;
}

class OrderEntity {
  orderNumber = "";
  billingAddress = new Address();
  shippingAddress = new Address();
  sameAsBilling = false;
}

// =============================================================================
// DEMO 1: Basic Reusable Fields
// =============================================================================

class BasicReusableForm extends Form<PersonWithAddresses> {
  constructor() {
    super("basic-reusable");
  }

  configure() {
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("Enter first name")
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter last name")
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // Reuse address fields for home address
    const homeSection = this.addSection("Home Address");
    AddressFields.configure(homeSection, "homeAddress");
    homeSection.endSection();

    // Reuse address fields for work address
    const workSection = this.addSection("Work Address");
    AddressFields.configure(workSection, "workAddress");
    workSection.endSection();
  }
}

const basicReusableCode = `// Define reusable address fields
class AddressFields {
  static configure(form: any, prefix: string = "") {
    const p = prefix ? \`\${prefix}.\` : "";

    form.addRow()
      .addField(\`\${p}street\`)
        .component(LuminoTextInput)
        .label("Street Address")
        .rules(Validators.required())
        .endField()
    .endRow();

    form.addRow()
      .addField(\`\${p}city\`)
        .component(LuminoTextInput)
        .label("City")
        .endField()
      .addField(\`\${p}state\`)
        .component(LuminoTextInput)
        .label("State")
        .endField()
      .addField(\`\${p}zipCode\`)
        .component(LuminoTextInput)
        .label("ZIP Code")
        .endField()
      .layout([2, 1, 1])
    .endRow();

    form.addRow()
      .addField(\`\${p}country\`)
        .component(LuminoSelect)
        .label("Country")
        .props({ options: countries })
        .endField()
    .endRow();
  }
}

// Use in form
class PersonForm extends Form<PersonWithAddresses> {
  configure() {
    this.addSection("Personal Information")
      // ... personal fields
    .endSection();

    // Reuse for home address
    const homeSection = this.addSection("Home Address");
    AddressFields.configure(homeSection, "homeAddress");
    homeSection.endSection();

    // Reuse for work address
    const workSection = this.addSection("Work Address");
    AddressFields.configure(workSection, "workAddress");
    workSection.endSection();
  }
}`;

// =============================================================================
// DEMO 2: Reusable with Conditional Logic
// =============================================================================

class ConditionalReusableForm extends Form<OrderEntity> {
  constructor() {
    super("conditional-reusable");
  }

  configure() {
    this.addSection("Order Details")
      .addRow()
        .addField("orderNumber")
          .component(LuminoTextInput)
          .label("Order Number")
          .placeholder("Enter order number")
          .rules(Validators.required({ message: "Order number is required" }))
          .endField()
      .endRow()
    .endSection();

    // Billing address section
    const billingSection = this.addSection("Billing Address");
    AddressFields.configure(billingSection, "billingAddress");
    billingSection.endSection();

    // Shipping address with "same as billing" option
    this.addSection("Shipping Address")
      .addRow()
        .addField("sameAsBilling")
          .component(LuminoCheckbox)
          .label("Same as billing address")
          .endField()
      .endRow()
    .endSection();

    // Shipping fields that hide when same as billing
    this.addSection("")
      .hideByCondition((ctx: FormContext) => ctx.getValue("sameAsBilling") === true)
      .addRow()
        .addField("shippingAddress.street")
          .component(LuminoTextInput)
          .label("Street Address")
          .placeholder("Enter street address")
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
          .label("ZIP Code")
          .endField()
        .layout([2, 1, 1])
      .endRow()
      .addRow()
        .addField("shippingAddress.country")
          .component(LuminoSelect)
          .label("Country")
          .props({ options: countries })
          .endField()
      .endRow()
    .endSection();
  }
}

const conditionalReusableCode = `class OrderForm extends Form<OrderEntity> {
  configure() {
    this.addSection("Order Details")
      .addRow()
        .addField("orderNumber")
          .component(LuminoTextInput)
          .label("Order Number")
          .endField()
      .endRow()
    .endSection();

    // Billing address - always shown
    const billingSection = this.addSection("Billing Address");
    AddressFields.configure(billingSection, "billingAddress");
    billingSection.endSection();

    // Checkbox to toggle shipping address
    this.addSection("Shipping Address")
      .addRow()
        .addField("sameAsBilling")
          .component(LuminoCheckbox)
          .label("Same as billing address")
          .endField()
      .endRow()
    .endSection();

    // Shipping fields - hidden when same as billing
    this.addSection("")
      .hideByCondition((ctx) => ctx.getValue("sameAsBilling"))
      .addRow()
        .addField("shippingAddress.street")
          .component(LuminoTextInput)
          .label("Street Address")
          .endField()
      .endRow()
      // ... more shipping fields
    .endSection();
  }
}`;

// =============================================================================
// DEMO 3: Factory Pattern
// =============================================================================

// Factory function for creating address sections
function createAddressSection(
  form: any,
  prefix: string,
  title: string,
  options: { required?: boolean; showType?: boolean } = {}
) {
  const { required = true, showType = false } = options;
  const p = prefix ? `${prefix}.` : "";

  const section = form.addSection(title);

  if (showType) {
    section.addRow()
      .addField(`${p}type`)
        .component(LuminoSelect)
        .label("Address Type")
        .props({ options: addressTypes })
        .endField()
    .endRow();
  }

  section.addRow()
    .addField(`${p}street`)
      .component(LuminoTextInput)
      .label("Street")
      .rules(required ? Validators.required({ message: "Street required" }) : undefined)
      .endField()
  .endRow();

  section.addRow()
    .addField(`${p}city`)
      .component(LuminoTextInput)
      .label("City")
      .endField()
    .addField(`${p}state`)
      .component(LuminoTextInput)
      .label("State")
      .endField()
    .layout([1, 1])
  .endRow();

  return section.endSection();
}

class FactoryEntity {
  primaryAddress = new Address();
  secondaryAddress = new Address();
}

class FactoryPatternForm extends Form<FactoryEntity> {
  constructor() {
    super("factory-pattern");
  }

  configure() {
    createAddressSection(this, "primaryAddress", "Primary Address", {
      required: true,
      showType: true,
    });

    createAddressSection(this, "secondaryAddress", "Secondary Address", {
      required: false,
      showType: true,
    });
  }
}

const factoryPatternCode = `// Factory function for creating address sections
function createAddressSection(
  form: any,
  prefix: string,
  title: string,
  options: { required?: boolean; showType?: boolean } = {}
) {
  const { required = true, showType = false } = options;
  const p = prefix ? \`\${prefix}.\` : "";

  const section = form.addSection(title);

  if (showType) {
    section.addRow()
      .addField(\`\${p}type\`)
        .component(LuminoSelect)
        .label("Address Type")
        .props({ options: addressTypes })
        .endField()
    .endRow();
  }

  section.addRow()
    .addField(\`\${p}street\`)
      .component(LuminoTextInput)
      .label("Street")
      .rules(required ? Validators.required() : undefined)
      .endField()
  .endRow();

  section.addRow()
    .addField(\`\${p}city\`)
      .component(LuminoTextInput)
      .label("City")
      .endField()
    .addField(\`\${p}state\`)
      .component(LuminoTextInput)
      .label("State")
      .endField()
    .layout([1, 1])
  .endRow();

  return section.endSection();
}

// Use factory in form
class AddressForm extends Form<Entity> {
  configure() {
    // Primary address - required, with type selector
    createAddressSection(this, "primaryAddress", "Primary Address", {
      required: true,
      showType: true,
    });

    // Secondary address - optional, with type selector
    createAddressSection(this, "secondaryAddress", "Secondary Address", {
      required: false,
      showType: true,
    });
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function FormReusablePage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Reusable Sections</h1>
      <p className="docs-page-subtitle">
        Learn how to create reusable field configurations that can be shared across
        multiple forms or used multiple times within the same form.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        Reusable sections help reduce code duplication and ensure consistency.
      </div>

      <div className="docs-section">
        <h2>Why Reusable Sections?</h2>
        <ul className="docs-list">
          <li><strong>DRY Principle</strong> - Don't repeat the same field definitions</li>
          <li><strong>Consistency</strong> - Same fields have same labels, validation, and layout</li>
          <li><strong>Maintainability</strong> - Change in one place updates everywhere</li>
          <li><strong>Composition</strong> - Build complex forms from simple pieces</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>1. Basic Reusable Fields</h2>
        <p>
          Create a static class method that adds fields to a form section.
          Use a prefix parameter for nested object binding.
        </p>
        <LiveDemo
          title="Basic Reusable Pattern"
          description="Address fields reused for home and work addresses"
          code={basicReusableCode}
          FormClass={BasicReusableForm}
          EntityClass={PersonWithAddresses}
        />
      </div>

      <div className="docs-section">
        <h2>2. With Conditional Logic</h2>
        <p>
          Reusable sections can be combined with conditional visibility.
          Here, shipping address can be hidden when "same as billing" is checked.
        </p>
        <LiveDemo
          title="Conditional Reusable"
          description="Shipping address hidden when same as billing"
          code={conditionalReusableCode}
          FormClass={ConditionalReusableForm}
          EntityClass={OrderEntity}
        />
      </div>

      <div className="docs-section">
        <h2>3. Factory Pattern</h2>
        <p>
          Use factory functions for more flexibility. Pass configuration options
          to customize each instance of the reusable section.
        </p>
        <LiveDemo
          title="Factory Pattern"
          description="Configurable address sections via factory function"
          code={factoryPatternCode}
          FormClass={FactoryPatternForm}
          EntityClass={FactoryEntity}
        />
      </div>

      <div className="docs-section">
        <h2>For Lists: include() Method</h2>
        <p>
          When working with Lists, use the <code>.include()</code> method to add reusable
          field components:
        </p>
        <pre className="docs-code">{`// Define reusable fields for list items
class AddressListFields extends Component<Address> {
  configure() {
    this.addRow()
      .addField("street")
        .component(LuminoTextInput)
        .label("Street")
        .endField()
    .endRow();

    this.addRow()
      .addField("city")
        .component(LuminoTextInput)
        .label("City")
        .endField()
      .addField("state")
        .component(LuminoTextInput)
        .label("State")
        .endField()
      .layout([1, 1])
    .endRow();
  }
}

// Use in a List
class PersonForm extends Form<Person> {
  configure() {
    this.addList<Address>("addresses")
      .as(LuminoTabs)
      .include(AddressListFields)  // Include reusable fields
      .tabLabel((addr, idx) => addr.city || \`Address #\${idx + 1}\`)
      .end();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Patterns Comparison</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Use Case</th>
              <th>Flexibility</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Static Method</td>
              <td>Simple field groups with prefix</td>
              <td>Low - fixed structure</td>
            </tr>
            <tr>
              <td>Factory Function</td>
              <td>Configurable field groups</td>
              <td>Medium - options parameter</td>
            </tr>
            <tr>
              <td>Component Class</td>
              <td>List item fields</td>
              <td>Medium - configure override</td>
            </tr>
            <tr>
              <td>Higher-Order Form</td>
              <td>Form mixins/decorators</td>
              <td>High - full customization</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Always use a prefix parameter</strong> to support nested object binding
          </li>
          <li>
            <strong>Keep reusable sections focused</strong> - one concept per section
            (e.g., address, contact info, payment details)
          </li>
          <li>
            <strong>Document the expected entity structure</strong> - what properties
            the reusable section expects
          </li>
          <li>
            <strong>Consider validation requirements</strong> - make validation configurable
            when fields might be optional in some contexts
          </li>
          <li>
            <strong>Use factory functions</strong> when you need different configurations
            of the same fields
          </li>
        </ul>
      </div>
    </div>
  );
}
