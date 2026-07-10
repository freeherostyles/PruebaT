export interface SupplierValidationStrategy {
  validate(data: Record<string, unknown>): void;
}
