import { describe, expect, it } from "vitest";
import { renderTemplate } from "./render-template";

describe("renderTemplate", () => {
  it("renders handlebars variables", () => {
    expect(renderTemplate("Hello {{pascalName}}", { pascalName: "Users" })).toBe("Hello Users");
  });
});
