import { describe, expect, it } from "vitest";
import { toCamelCase, toKebabCase, toPascalCase, toPluralName, toSingularName } from "./case";

describe("case utilities", () => {
  it("converts names to pascal case", () => {
    expect(toPascalCase("users")).toBe("Users");
    expect(toPascalCase("blog-posts")).toBe("BlogPosts");
  });

  it("converts names to camel and kebab case", () => {
    expect(toCamelCase("blog-posts")).toBe("blogPosts");
    expect(toKebabCase("blogPosts")).toBe("blog-posts");
  });

  it("pluralizes and singularizes simple names", () => {
    expect(toPluralName("user")).toBe("users");
    expect(toPluralName("users")).toBe("users");
    expect(toSingularName("users")).toBe("user");
  });
});
