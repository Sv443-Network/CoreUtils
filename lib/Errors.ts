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

/** Error while validating checksum */
export class ChecksumMismatchError extends DatedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ChecksumMismatchError";
  }
}

/** Error while migrating data */
export class MigrationError extends DatedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "MigrationError";
  }
}

/** Error while validating data */
export class ValidationError extends DatedError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ValidationError";
  }
}
