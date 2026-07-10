import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Divider,
  Skeleton,
  Alert,
} from '@mui/material';
import { useSupplierDetail } from '../hooks/use-supplier-detail';
import { StatusChip } from '../components/StatusChip';
import { SupplierTypeChip } from '../components/SupplierTypeChip';

interface SupplierDetailDialogProps {
  supplierId: string | null;
  open: boolean;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2">
        {value ?? '—'}
      </Typography>
    </Stack>
  );
}

export function SupplierDetailDialog({ supplierId, open, onClose }: SupplierDetailDialogProps) {
  const { data, isLoading, isError, refetch } = useSupplierDetail(supplierId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isLoading ? 'Cargando…' : 'Detalle del proveedor'}
      </DialogTitle>
      <DialogContent dividers>
        {isLoading && (
          <Stack spacing={2}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="text" height={24} />
            ))}
          </Stack>
        )}

        {isError && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Reintentar
              </Button>
            }
          >
            No se pudo cargar el detalle.
          </Alert>
        )}

        {data && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {data.businessName ?? ([data.firstName, data.lastName].filter(Boolean).join(' ') || '—')}
              <StatusChip status={data.status} />
              <SupplierTypeChip type={data.supplierType} />
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Identificación
              </Typography>
              <Field label="RFC" value={data.rfc} />
              <Field label="CURP" value={data.curp} />
              {data.businessName && <Field label="Nombre comercial" value={data.tradeName} />}
              {!data.businessName && (
                <>
                  <Field label="Nombre(s)" value={data.firstName} />
                  <Field label="Apellido paterno" value={data.lastName} />
                  <Field label="Apellido materno" value={data.secondLastName} />
                </>
              )}
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Contacto
              </Typography>
              <Field label="Persona de contacto" value={data.contactPerson} />
              <Field label="Correo electrónico" value={data.email} />
              <Field label="Teléfono" value={data.phone} />
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Auditoría
              </Typography>
              <Field label="Creado por" value={data.createdBy?.fullName} />
              <Field label="Correo del creador" value={data.createdBy?.email} />
              <Field label="Fecha de creación" value={new Date(data.createdAt).toLocaleString('es-MX')} />
              <Field label="Última actualización" value={new Date(data.updatedAt).toLocaleString('es-MX')} />
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
