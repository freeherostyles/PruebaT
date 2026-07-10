import { Stack, TextField } from '@mui/material';
import type { UseFormRegister, FormState } from 'react-hook-form';
import type { SupplierFormValues } from './SupplierForm';

interface PhysicalSupplierFieldsProps {
  register: UseFormRegister<SupplierFormValues>;
  formState: FormState<SupplierFormValues>;
}

export function PhysicalSupplierFields({
  register,
  formState: { errors },
}: PhysicalSupplierFieldsProps) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Nombre(s)"
        fullWidth
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
        {...register('firstName', {
          required: 'El nombre es obligatorio',
          maxLength: { value: 100, message: 'Máximo 100 caracteres' },
        })}
      />
      <TextField
        label="Apellido paterno"
        fullWidth
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
        {...register('lastName', {
          required: 'El apellido es obligatorio',
          maxLength: { value: 100, message: 'Máximo 100 caracteres' },
        })}
      />
      <TextField
        label="Apellido materno"
        fullWidth
        error={!!errors.secondLastName}
        helperText={errors.secondLastName?.message}
        {...register('secondLastName', {
          maxLength: { value: 100, message: 'Máximo 100 caracteres' },
        })}
      />
    </Stack>
  );
}
