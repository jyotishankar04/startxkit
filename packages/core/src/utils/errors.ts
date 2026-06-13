export class BackendKitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackendKitError";
  }
}

export function isBackendKitError(error: unknown): error is BackendKitError {
  return error instanceof BackendKitError;
}
