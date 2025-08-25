/**
 * @module Errors
 * Contains custom error classes that all have a `date` property set to the time of the error throw
 */

/** Base class for all custom error classes - adds a `date` prop set to the time when the error was thrown */
export class DatedError extends Error {
  public readonly date: Date;
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    this.date = new Date();
  }
}

/** Error while validating checksum - extends {@linkcode DatedError} */
export class ChecksumMismatchError extends DatedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ChecksumMismatchError";
  }
}

/** Custom error class that can have a custom name - extends {@linkcode DatedError} */
export class CustomError extends DatedError {
  constructor(name: string, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = name;
  }
}

/** Error while migrating data - extends {@linkcode DatedError} */
export class MigrationError extends DatedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "MigrationError";
  }
}

/** Error while validating data - extends {@linkcode DatedError} */
export class ValidationError extends DatedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ValidationError";
  }
}

/** Error related to script context (e.g. trying to access APIs that aren't supported by the executing JS engine) - extends {@linkcode DatedError} */
export class ScriptContextError extends DatedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ScriptContextError";
  }
}

/** Error related to networking - extends {@linkcode DatedError} */
export class NetworkError extends DatedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "NetworkError";
  }
}
