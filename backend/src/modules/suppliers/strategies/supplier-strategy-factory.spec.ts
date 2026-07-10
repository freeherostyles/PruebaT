import { SupplierType } from '../supplier-type.enum';
import { SupplierStrategyFactory } from './supplier-strategy-factory';
import { PersonaFisicaValidationStrategy } from './persona-fisica-validation-strategy';
import { PersonaMoralValidationStrategy } from './persona-moral-validation-strategy';

describe('SupplierStrategyFactory', () => {
  const factory = new SupplierStrategyFactory(
    new PersonaFisicaValidationStrategy(),
    new PersonaMoralValidationStrategy(),
  );

  it('returns persona física strategy', () => {
    const strategy = factory.getStrategy(SupplierType.PERSONA_FISICA);
    expect(strategy).toBeInstanceOf(PersonaFisicaValidationStrategy);
  });

  it('returns persona moral strategy', () => {
    const strategy = factory.getStrategy(SupplierType.PERSONA_MORAL);
    expect(strategy).toBeInstanceOf(PersonaMoralValidationStrategy);
  });

  it('throws for unsupported type', () => {
    expect(() => factory.getStrategy('INVALID' as SupplierType)).toThrow();
  });
});
