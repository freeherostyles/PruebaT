import { BadRequestException, Injectable } from '@nestjs/common';
import { SupplierValidationStrategy } from './supplier-validation-strategy.interface';

const RFC_PATTERN_PHYSICAL = /^[A-Z]{4}\d{6}[A-Z0-9]{3}$/;
const CURP_PATTERN = /^[A-Z]{4}\d{6}[A-Z0-9]{8}$/;

@Injectable()
export class PersonaFisicaValidationStrategy implements SupplierValidationStrategy {
  validate(data: Record<string, unknown>): void {
    if (!data.firstName) {
      throw new BadRequestException('firstName is required for persona física');
    }
    if (!data.lastName) {
      throw new BadRequestException('lastName is required for persona física');
    }
    if (!data.rfc) {
      throw new BadRequestException('rfc is required');
    }
    if (!RFC_PATTERN_PHYSICAL.test(data.rfc as string)) {
      throw new BadRequestException(
        'Invalid RFC format for persona física — expected 13 characters (4 letters + 6 digits + 3 alphanumeric)',
      );
    }
    if (data.curp && !CURP_PATTERN.test(data.curp as string)) {
      throw new BadRequestException(
        'Invalid CURP format — expected 18 characters',
      );
    }
  }
}
