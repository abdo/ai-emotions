export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    public message: string,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
