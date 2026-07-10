import { BadRequestException } from '@nestjs/common';
import { PersonaMoralValidationStrategy } from './persona-moral-validation-strategy';

describe('PersonaMoralValidationStrategy', () => {
  const strategy = new PersonaMoralValidationStrategy();

  describe('validate', () => {
    it('accepts valid data', () => {
      expect(() =>
        strategy.validate({
          businessName: 'Empresa S.A. de C.V.',
          rfc: 'EMP920101ABC',
        }),
      ).not.toThrow();
    });

    it('rejects missing businessName', () => {
      expect(() =>
        strategy.validate({
          rfc: 'EMP920101ABC',
        }),
      ).toThrow(BadRequestException);
    });

    it('rejects missing rfc', () => {
      expect(() =>
        strategy.validate({
          businessName: 'Empresa S.A. de C.V.',
        }),
      ).toThrow(BadRequestException);
    });

    it('rejects invalid RFC format', () => {
      expect(() =>
        strategy.validate({
          businessName: 'Empresa S.A. de C.V.',
          rfc: 'INVALID',
        }),
      ).toThrow(BadRequestException);
    });

    it('rejects invalid RFC (wrong length for moral)', () => {
      expect(() =>
        strategy.validate({
          businessName: 'Empresa S.A. de C.V.',
          rfc: 'JUAN920101ABC',
        }),
      ).toThrow(BadRequestException);
    });
  });
});
