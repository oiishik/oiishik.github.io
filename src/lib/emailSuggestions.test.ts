import { describe, expect, it } from "vitest";
import { emailDomainSuggestions } from "./emailSuggestions";

describe("emailDomainSuggestions", () => {
  it("stays closed until @ is typed", () => {
    expect(emailDomainSuggestions("oishik")).toEqual([]);
  });

  it("offers the three popular domains as soon as @ is pressed", () => {
    expect(emailDomainSuggestions("oishik@")).toEqual([
      "oishik@gmail.com",
      "oishik@outlook.com",
      "oishik@rediffmail.com",
    ]);
  });

  it("narrows to domains that still match", () => {
    expect(emailDomainSuggestions("oishik@g")).toEqual(["oishik@gmail.com"]);
    expect(emailDomainSuggestions("oishik@out")).toEqual(["oishik@outlook.com"]);
  });

  it("hides a domain once it is already complete", () => {
    expect(emailDomainSuggestions("oishik8sengupta@gmail.com")).toEqual([]);
  });
});
