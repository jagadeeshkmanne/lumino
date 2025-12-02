/**
 * AddressFields Component
 *
 * Reusable field definitions for Address entity.
 * Can be included in Forms or Lists via .include(AddressFields)
 */

import { Component, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect, LuminoButton } from "lumino/react";
import { Address } from "../entities/Address";
import { addressTypes, countries } from "../data/options";

export class AddressFields extends Component<Address> {
  configure() {
    this.addRow()
      .addField("type")
        .component(LuminoSelect)
        .label("Address Type")
        .placeholder("Select type")
        .props({ options: addressTypes })
        .rules(Validators.required({ message: "Address type is required" }))
      .endField()
    .endRow();

    this.addRow()
      .addField("street")
        .component(LuminoTextInput)
        .label("Street Address")
        .placeholder("Enter street address")
        .rules(Validators.required({ message: "Street address is required" }))
      .endField()
    .endRow();

    this.addRow()
      .addField("city")
        .component(LuminoTextInput)
        .label("City")
        .placeholder("Enter city")
        .rules(Validators.required({ message: "City is required" }))
      .endField()
      .addField("state")
        .component(LuminoTextInput)
        .label("State")
        .placeholder("Enter state")
        .rules(Validators.required({ message: "State is required" }))
      .endField()
      .layout([1, 1])
    .endRow();

    this.addRow()
      .addField("zipCode")
        .component(LuminoTextInput)
        .label("ZIP Code")
        .placeholder("Enter ZIP code")
        .rules(Validators.required({ message: "ZIP code is required" }))
      .endField()
      .addField("country")
        .component(LuminoSelect)
        .label("Country")
        .placeholder("Select country")
        .props({ options: countries })
        .rules(Validators.required({ message: "Country is required" }))
      .endField()
      .layout([1, 1])
    .endRow();

    // Delete button - hidden in view mode
    this.addRow()
      .addComponent(LuminoButton)
        .children("Delete Address")
        .props({ variant: "secondary" })
        .onClick((ctx) => { ctx.removeCurrentItem?.(); })
        .hideByCondition((ctx) => ctx.mode === "view")
      .endComponent()
    .endRow();
  }
}
