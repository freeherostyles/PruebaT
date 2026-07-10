import { Stack, TextField, MenuItem, Typography } from '@mui/material';
import type { UseFormReturn } from 'react-hook-form';
import { PhysicalSupplierFields } from './PhysicalSupplierFields';
import { CompanySupplierFields } from './CompanySupplierFields';
import type { SupplierType } from '../types/supplier';

export interface SupplierFormValues {
  supplierType: SupplierType;
  firstName: string;
  lastName: string;
  secondLastName: string;
  businessName: string;
  tradeName: string;
  rfc: string;
  curp: string;
  contactPerson: string;
  email: string;
  phone: string;
}

interface SupplierFormProps {
  form: UseFormReturn<SupplierFormValues>;
  readOnly?: boolean;
}

export function SupplierForm({ form, readOnly = false }: SupplierFormProps) {
  const { register, watch, formState } = form;
  const supplierType = watch('supplierType');
  const { errors } = formState;

  const isPersonaFisica = supplierType === 'PERSONA_FISICA';

  return (
    <Stack spacing={2.5}>
      <TextField
        label="Tipo de proveedor"
        select
        fullWidth
        defaultValue="PERSONA_FISICA"
        error={!!errors.supplierType}
        helperText={errors.supplierType?.message}
        slotProps={{
          input: readOnly ? { readOnly: true } : undefined,
        }}
        {...register('supplierType', { required: 'El tipo es obligatorio' })}
      >
        <MenuItem value="PERSONA_FISICA">Persona Física</MenuItem>
        <MenuItem value="PERSONA_MORAL">Persona Moral</MenuItem>
      </TextField>

      <Typography variant="subtitle2" color="text.secondary">
        {isPersonaFisica ? 'Datos personales' : 'Datos de la empresa'}
      </Typography>

      {isPersonaFisica ? (
        <PhysicalSupplierFields register={register} formState={formState} />
      ) : (
        <CompanySupplierFields register={register} formState={formState} />
      )}

      <Typography variant="subtitle2" color="text.secondary">
        Identificación fiscal
      </Typography>

      <TextField
        label="RFC"
        fullWidth
        error={!!errors.rfc}
        helperText={
          errors.rfc?.message ??
          (isPersonaFisica ? '13 caracteres' : '12 caracteres')
        }
        slotProps={{
          input: readOnly ? { readOnly: true } : undefined,
        }}
        {...register('rfc', {
          required: 'El RFC es obligatorio',
          maxLength: { value: 13, message: 'Máximo 13 caracteres' },
          minLength: { value: 12, message: 'Mínimo 12 caracteres' },
          pattern: {
            value: /^[A-Z0-9]{12,13}$/,
            message: 'Formato de RFC inválido',
          },
        })}
      />

      {isPersonaFisica && (
        <TextField
          label="CURP"
          fullWidth
          error={!!errors.curp}
          helperText={errors.curp?.message}
          {...register('curp', {
            maxLength: { value: 18, message: 'Máximo 18 caracteres' },
          })}
        />
      )}

      <Typography variant="subtitle2" color="text.secondary">
        Contacto
      </Typography>

      <TextField
        label="Persona de contacto"
        fullWidth
        error={!!errors.contactPerson}
        helperText={errors.contactPerson?.message}
        {...register('contactPerson', {
          maxLength: { value: 150, message: 'Máximo 150 caracteres' },
        })}
      />

      <TextField
        label="Correo electrónico"
        type="email"
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email', {
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Formato de correo inválido',
          },
        })}
      />

      <TextField
        label="Teléfono"
        fullWidth
        error={!!errors.phone}
        helperText={errors.phone?.message}
        {...register('phone', {
          maxLength: { value: 30, message: 'Máximo 30 caracteres' },
        })}
      />
    </Stack>
  );
}
