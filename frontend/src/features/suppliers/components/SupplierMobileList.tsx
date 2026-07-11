import {
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Supplier, SupplierStatus } from '../types/supplier';
import { StatusChip } from '../../../shared/components/StatusChip';
import { SupplierTypeChip } from './SupplierTypeChip';

interface SupplierMobileListProps {
  data: Supplier[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isAdmin: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: SupplierStatus) => void;
}

function getSupplierName(supplier: Supplier) {
  if (supplier.businessName) {
    return supplier.businessName;
  }

  return (
    [supplier.firstName, supplier.lastName, supplier.secondLastName]
      .filter(Boolean)
      .join(' ') || 'Proveedor sin nombre'
  );
}

export function SupplierMobileList({
  data,
  total,
  page,
  limit,
  totalPages,
  isAdmin,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: SupplierMobileListProps) {
  return (
    <Stack spacing={1.5}>
      {data.map((supplier) => (
        <Card key={supplier.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <StatusChip status={supplier.status} />
                  <SupplierTypeChip type={supplier.supplierType} />
                </Stack>

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {getSupplierName(supplier)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    RFC: {supplier.rfc}
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Contacto: {supplier.contactPerson || 'No definido'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correo: {supplier.email || 'No definido'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Teléfono: {supplier.phone || 'No definido'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Tooltip title="Ver detalle">
                  <IconButton size="small" onClick={() => onView(supplier.id)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {isAdmin && (
                  <>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => onEdit(supplier.id)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={supplier.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}>
                      <IconButton
                        size="small"
                        color={supplier.status === 'ACTIVE' ? 'warning' : 'success'}
                        onClick={() =>
                          onToggleStatus(
                            supplier.id,
                            supplier.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                          )
                        }
                      >
                        {supplier.status === 'ACTIVE' ? (
                          <BlockIcon fontSize="small" />
                        ) : (
                          <CheckCircleIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => onDelete(supplier.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {total} proveedores
              </Typography>
              <FormControl size="small">
                <Select value={String(limit)} onChange={(e) => onLimitChange(Number(e.target.value))}>
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="20">20</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Pagination
              page={page}
              count={Math.max(totalPages, 1)}
              onChange={(_, nextPage) => onPageChange(nextPage)}
              color="primary"
              size="small"
              showFirstButton
              showLastButton
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
