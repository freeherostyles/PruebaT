import { BadRequestException } from '@nestjs/common';
import { PersonaFisicaValidationStrategy } from './persona-fisica-validation-strategy';

describe('PersonaFisicaValidationStrategy', () => {
  const strategy = new PersonaFisicaValidationStrategy();

  describe('validate', () => {
    it('accepts valid data', () => {
      expect(() =>
        strategy.validate({
          firstName: 'Juan',
          lastName: 'Pérez',
          rfc: 'JUAN920101ABC',
          curp: 'JUAN920101HDFLRN01',
        }),
      ).not.toThrow();
    });

    it('rejects missing firstName', () => {
      expect(() =>
        strategy.validate({
          lastName: 'Pérez',
          rfc: 'JUAN920101ABC',
        }),
      ).toThrow(BadRequestException);
    });

    it('rejects missing lastName', () => {
      expect(() =>
        strategy.validate({
          firstName: 'Juan',
          rfc: 'JUAN920101ABC',
        }),
      ).toThrow(BadRequestException);
    });

    it('rejects missing rfc', () => {
      expect(() =>
        strategy.validate({
          firstName: 'Juan',
          lastName: 'Pérez',
        }),
      ).toThrow(BadRequestException);
    });

    it('rejects invalid RFC format', () => {
      expect(() =>
        strategy.validate({
          firstName: 'Juan',
          lastName: 'Pérez',
          rfc: 'INVALID',
        }),
      ).toThrow(BadRequestException);
    });

    it('rejects invalid RFC (wrong length)', () => {
      expect(() =>
        strategy.validate({
          firstName: 'Juan',
          lastName: 'Pérez',
          rfc: 'JUAN92ABC',
        }),
      ).toThrow(BadRequestException);
    });

    it('rejects invalid CURP when provided', () => {
      expect(() =>
        strategy.validate({
          firstName: 'Juan',
          lastName: 'Pérez',
          rfc: 'JUAN920101ABC',
          curp: 'SHORT',
        }),
      ).toThrow(BadRequestException);
    });

    it('accepts data without curp', () => {
      expect(() =>
        strategy.validate({
          firstName: 'Juan',
          lastName: 'Pérez',
          rfc: 'JUAN920101ABC',
        }),
      ).not.toThrow();
    });
  });
});
