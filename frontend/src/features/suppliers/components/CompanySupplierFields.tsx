import { Stack, TextField } from '@mui/material';
import type { UseFormRegister, FormState } from 'react-hook-form';
import type { SupplierFormValues } from './SupplierForm';

interface CompanySupplierFieldsProps {
  register: UseFormRegister<SupplierFormValues>;
  formState: FormState<SupplierFormValues>;
}

export function CompanySupplierFields({
  register,
  formState: { errors },
}: CompanySupplierFieldsProps) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Razón social"
        fullWidth
        error={!!errors.businessName}
        helperText={errors.businessName?.message}
        {...register('businessName', {
          required: 'La razón social es obligatoria',
          maxLength: { value: 200, message: 'Máximo 200 caracteres' },
        })}
      />
      <TextField
        label="Nombre comercial"
        fullWidth
        error={!!errors.tradeName}
        helperText={errors.tradeName?.message}
        {...register('tradeName', {
          maxLength: { value: 200, message: 'Máximo 200 caracteres' },
        })}
      />
    </Stack>
  );
}
