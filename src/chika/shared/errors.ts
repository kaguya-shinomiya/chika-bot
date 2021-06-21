export class CriticalError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, CriticalError.prototype);
  }
}
