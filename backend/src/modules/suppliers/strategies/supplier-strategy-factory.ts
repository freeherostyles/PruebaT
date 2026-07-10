import { Injectable } from '@nestjs/common';
import { SupplierType } from '../supplier-type.enum';
import { SupplierValidationStrategy } from './supplier-validation-strategy.interface';
import { PersonaFisicaValidationStrategy } from './persona-fisica-validation-strategy';
import { PersonaMoralValidationStrategy } from './persona-moral-validation-strategy';

@Injectable()
export class SupplierStrategyFactory {
  constructor(
    private readonly personaFisicaStrategy: PersonaFisicaValidationStrategy,
    private readonly personaMoralStrategy: PersonaMoralValidationStrategy,
  ) {}

  getStrategy(type: SupplierType): SupplierValidationStrategy {
    switch (type) {
      case SupplierType.PERSONA_FISICA:
        return this.personaFisicaStrategy;
      case SupplierType.PERSONA_MORAL:
        return this.personaMoralStrategy;
      default:
        throw new Error(`Unsupported supplier type: ${String(type)}`);
    }
  }
}
