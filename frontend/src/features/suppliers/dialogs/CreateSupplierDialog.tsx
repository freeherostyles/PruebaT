import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { SupplierForm, type SupplierFormValues } from '../components/SupplierForm';
import { useCreateSupplier } from '../hooks/use-create-supplier';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import type { CreateSupplierPayload } from '../types/supplier';

interface CreateSupplierDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateSupplierDialog({ open, onClose }: CreateSupplierDialogProps) {
  const createMutation = useCreateSupplier();
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);

  const form = useForm<SupplierFormValues>({
    defaultValues: {
      supplierType: 'PERSONA_FISICA',
      firstName: '',
      lastName: '',
      secondLastName: '',
      businessName: '',
      tradeName: '',
      rfc: '',
      curp: '',
      contactPerson: '',
      email: '',
      phone: '',
    },
  });

  const isDirty = form.formState.isDirty;

  const handleClose = () => {
    if (isDirty) {
      setConfirmExitOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    setConfirmExitOpen(false);
    onClose();
  };

  const handleSubmit = form.handleSubmit((values) => {
    const payload: CreateSupplierPayload = {
      supplierType: values.supplierType,
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      secondLastName: values.secondLastName || undefined,
      businessName: values.businessName || undefined,
      tradeName: values.tradeName || undefined,
      rfc: values.rfc.toUpperCase(),
      curp: values.curp || undefined,
      contactPerson: values.contactPerson || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Nuevo proveedor</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <SupplierForm form={form} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={createMutation.isPending} sx={{ textTransform: 'none' }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending}
              startIcon={createMutation.isPending ? <CircularProgress size={16} /> : undefined}
              sx={{ textTransform: 'none' }}
            >
              {createMutation.isPending ? 'Guardando…' : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmExitOpen}
        title="¿Salir sin guardar?"
        description="Los cambios realizados se perderán si cierras este formulario."
        confirmLabel="Salir"
        cancelLabel="Continuar editando"
        onConfirm={handleConfirmExit}
        onCancel={() => setConfirmExitOpen(false)}
      />
    </>
  );
}
