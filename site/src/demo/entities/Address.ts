/**
 * Address Entity
 *
 * Entity class for address data used in Lists.
 */

export class Address {
  type: "home" | "work" | "other" = "home";
  street = "";
  city = "";
  state = "";
  zipCode = "";
  country = "us";
}
