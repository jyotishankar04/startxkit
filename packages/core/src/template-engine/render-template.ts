import Handlebars from "handlebars";

export function renderTemplate(source: string, variables: Record<string, unknown>): string {
  return Handlebars.compile(source, { noEscape: true })(variables);
}
