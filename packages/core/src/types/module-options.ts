export type ModuleLayer =
  | "route-controller"
  | "route-controller-service"
  | "route-controller-service-repository"
  | "full";

export interface ModuleOptions {
  name: string;
  layer: ModuleLayer;
  crud: boolean;
  validation: boolean;
  tests: boolean;
  overwrite?: boolean;
  cwd?: string;
}
