export default class InvalidTransactionError extends Error {
  constructor(requiredField) {
    super(`Invalid transaction. ${requiredField} is required.`);
  }
}
