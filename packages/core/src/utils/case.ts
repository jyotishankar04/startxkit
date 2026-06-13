const splitWords = (value: string): string[] =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());

export function toPascalCase(value: string): string {
  return splitWords(value)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function toCamelCase(value: string): string {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toKebabCase(value: string): string {
  return splitWords(value).join("-");
}

export function toPluralName(value: string): string {
  const kebab = toKebabCase(value);
  if (kebab.endsWith("s")) return kebab;
  if (kebab.endsWith("y")) return `${kebab.slice(0, -1)}ies`;
  return `${kebab}s`;
}

export function toSingularName(value: string): string {
  const kebab = toKebabCase(value);
  if (kebab.endsWith("ies")) return `${kebab.slice(0, -3)}y`;
  if (kebab.endsWith("s")) return kebab.slice(0, -1);
  return kebab;
}
