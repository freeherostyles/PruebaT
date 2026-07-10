import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Skeleton,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { SupplierForm, type SupplierFormValues } from '../components/SupplierForm';
import { useSupplierDetail } from '../hooks/use-supplier-detail';
import { useUpdateSupplier } from '../hooks/use-update-supplier';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import type { UpdateSupplierPayload } from '../types/supplier';

interface EditSupplierDialogProps {
  supplierId: string | null;
  open: boolean;
  onClose: () => void;
}

export function EditSupplierDialog({ supplierId, open, onClose }: EditSupplierDialogProps) {
  const { data, isLoading, isError } = useSupplierDetail(supplierId);
  const updateMutation = useUpdateSupplier(supplierId ?? '');
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

  useEffect(() => {
    if (data) {
      form.reset({
        supplierType: data.supplierType,
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        secondLastName: data.secondLastName ?? '',
        businessName: data.businessName ?? '',
        tradeName: data.tradeName ?? '',
        rfc: data.rfc,
        curp: data.curp ?? '',
        contactPerson: data.contactPerson ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
      });
    }
  }, [data, form]);

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
    if (!supplierId) return;

    const payload: UpdateSupplierPayload = {
      firstName: values.firstName || null,
      lastName: values.lastName || null,
      secondLastName: values.secondLastName || null,
      businessName: values.businessName || null,
      tradeName: values.tradeName || null,
      rfc: values.rfc.toUpperCase(),
      curp: values.curp || null,
      contactPerson: values.contactPerson || null,
      email: values.email || null,
      phone: values.phone || null,
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  });

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {isLoading ? 'Cargando…' : 'Editar proveedor'}
        </DialogTitle>
        {isLoading && (
          <DialogContent dividers>
            <Skeleton variant="rounded" height={400} />
          </DialogContent>
        )}
        {isError && (
          <DialogContent dividers>
            <Alert severity="error">No se pudo cargar el proveedor.</Alert>
          </DialogContent>
        )}
        {data && (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <SupplierForm form={form} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} disabled={updateMutation.isPending} sx={{ textTransform: 'none' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={updateMutation.isPending}
                startIcon={updateMutation.isPending ? <CircularProgress size={16} /> : undefined}
                sx={{ textTransform: 'none' }}
              >
                {updateMutation.isPending ? 'Guardando…' : 'Guardar'}
              </Button>
            </DialogActions>
          </form>
        )}
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
