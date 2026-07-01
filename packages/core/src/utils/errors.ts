export class StartXKitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StartXKitError";
  }
}

export function isStartXKitError(error: unknown): error is StartXKitError {
  return error instanceof StartXKitError;
}
