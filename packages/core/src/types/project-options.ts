import type {
  Architecture,
  Framework,
  Language,
  LoggerOption,
  PackageManager,
  ValidationLibrary,
} from "./config";

export interface ProjectOptions {
  projectName: string;
  targetDir: string;
  framework: Framework;
  language: Language;
  architecture: Architecture;
  packageManager: PackageManager;
  apiPrefix: string;
  addCors: boolean;
  addEnv: boolean;
  validation: ValidationLibrary;
  logger: LoggerOption;
  addLogger: boolean;
  addErrorHandler: boolean;
  dependencyInjection: boolean;
  addTesting: boolean;
  addDocker: boolean;
  installDependencies: boolean;
}
