/** An error that is safe to show to the client. Everything else becomes a generic 500. */
export class ApiError extends Error {
  /**
   * @param {number} status   HTTP status code
   * @param {string} code     stable machine readable code, e.g. "INVALID_OTP"
   * @param {string} message  human readable message
   * @param {object} [details] extra data (field errors, retryAfterSeconds ...)
   */
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
