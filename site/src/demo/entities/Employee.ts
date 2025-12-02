/**
 * Employee Entity
 *
 * Entity class with defaults for all form fields.
 */

import { Address } from "./Address";
import { Experience } from "./Experience";

export class Employee {
  id?: number;

  // Basic Information
  firstName = "";
  lastName = "";
  email = "";
  age: number | null = null;
  bio = "";

  // Selection Fields
  department = "";
  priority = "";
  status = "";
  countries: string[] = [];
  preferredCountry: string | null = null;

  // Boolean Fields
  isActive: boolean | null = null;
  receiveNewsletter: boolean | null = null;
  size = "";
  notifications: string[] = [];

  // Date/Time Fields
  startDate: string | null = null;
  preferredTime: string | null = null;

  // Lists
  addresses: Address[] = [];
  experiences: Experience[] = [];
}

// Factory for creating empty Employee entity
export const createEmptyEmployee = (): Employee => new Employee();

// Factory for creating sample Employee (for edit mode demo)
export const createSampleEmployee = (): Employee => {
  const emp = new Employee();
  emp.id = 1;
  emp.firstName = "Jagadeesh";
  emp.lastName = "Manne";
  emp.email = "jagadeesh.manne@example.com";
  emp.age = 41;
  emp.bio = "Senior software architect with expertise in TypeScript frameworks and React.";
  emp.department = "engineering";
  emp.priority = "high";
  emp.status = "active";
  emp.countries = ["us", "uk", "ca"];
  emp.preferredCountry = "us";
  emp.isActive = true;
  emp.receiveNewsletter = true;
  emp.size = "large";
  emp.notifications = ["email", "push"];
  emp.startDate = "2020-01-15";
  emp.preferredTime = "09:00";

  // Addresses
  emp.addresses = [
    { type: "home", street: "123 Oak Avenue", city: "San Jose", state: "CA", zipCode: "95134", country: "us" },
    { type: "work", street: "1 Infinite Loop", city: "Cupertino", state: "CA", zipCode: "95014", country: "us" },
  ];

  // Experiences
  emp.experiences = [
    { company: "Apple", title: "Senior Software Engineer", startDate: "2020-01-15", endDate: "", description: "Leading frontend architecture for enterprise applications" },
    { company: "Google", title: "Software Engineer", startDate: "2017-06-01", endDate: "2019-12-31", description: "Built scalable web applications with React and TypeScript" },
  ];

  return emp;
};
