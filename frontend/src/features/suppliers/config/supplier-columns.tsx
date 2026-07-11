import { IconButton, Stack, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { GridColDef } from '@mui/x-data-grid';
import { StatusChip } from '../../../shared/components/StatusChip';
import { SupplierTypeChip } from '../components/SupplierTypeChip';
import type { Supplier, SupplierStatus } from '../types/supplier';

interface ActionHandlers {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: SupplierStatus) => void;
}

export function createSupplierColumns(
  isAdmin: boolean,
  actions?: ActionHandlers,
): GridColDef[] {
  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Acciones',
      width: isAdmin ? 200 : 80,
      sortable: false,
      renderCell: (params) => {
        const row = params.row as Supplier;
        return (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Ver detalle">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  actions?.onView(row.id);
                }}
                aria-label="Ver detalle"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {isAdmin && (
              <>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      actions?.onEdit(row.id);
                    }}
                    aria-label="Editar"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={row.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      actions?.onToggleStatus(
                        row.id,
                        row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                      );
                    }}
                    aria-label={row.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                    color={row.status === 'ACTIVE' ? 'warning' : 'success'}
                  >
                    {row.status === 'ACTIVE' ? (
                      <BlockIcon fontSize="small" />
                    ) : (
                      <CheckCircleIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      actions?.onDelete(row.id);
                    }}
                    aria-label="Eliminar"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        );
      },
    },
    {
      field: 'supplierType',
      headerName: 'Tipo',
      width: 140,
      renderCell: (params) => <SupplierTypeChip type={params.value} />,
      sortable: true,
    },
    {
      field: 'rfc',
      headerName: 'RFC',
      width: 150,
      sortable: true,
    },
    {
      field: 'name',
      headerName: 'Nombre / Razón Social',
      flex: 1,
      minWidth: 200,
      valueGetter: (_, row) => {
        if (row.businessName) return row.businessName;
        return [row.firstName, row.lastName, row.secondLastName]
          .filter(Boolean)
          .join(' ');
      },
      sortable: false,
    },
    {
      field: 'contactPerson',
      headerName: 'Contacto',
      width: 160,
      sortable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      sortable: false,
    },
    {
      field: 'phone',
      headerName: 'Teléfono',
      width: 130,
      sortable: false,
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 110,
      renderCell: (params) => <StatusChip status={params.value} />,
      sortable: true,
    },
    {
      field: 'createdAt',
      headerName: 'Fecha creación',
      width: 140,
      type: 'date',
      valueGetter: (_, row) => new Date(row.createdAt),
      sortable: true,
    },
  ];

  return columns;
}
