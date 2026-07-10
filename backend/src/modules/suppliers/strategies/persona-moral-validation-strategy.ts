import { BadRequestException, Injectable } from '@nestjs/common';
import { SupplierValidationStrategy } from './supplier-validation-strategy.interface';

const RFC_PATTERN_MORAL = /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/;

@Injectable()
export class PersonaMoralValidationStrategy implements SupplierValidationStrategy {
  validate(data: Record<string, unknown>): void {
    if (!data.businessName) {
      throw new BadRequestException(
        'businessName is required for persona moral',
      );
    }
    if (!data.rfc) {
      throw new BadRequestException('rfc is required');
    }
    if (!RFC_PATTERN_MORAL.test(data.rfc as string)) {
      throw new BadRequestException(
        'Invalid RFC format for persona moral — expected 12 characters (3 letters + 6 digits + 3 alphanumeric)',
      );
    }
  }
}
