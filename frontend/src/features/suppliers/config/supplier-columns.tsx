import type { GridColDef } from '@mui/x-data-grid';
import { StatusChip } from '../components/StatusChip';
import { SupplierTypeChip } from '../components/SupplierTypeChip';

export function createSupplierColumns(
  _isAdmin: boolean,
): GridColDef[] {
  const columns: GridColDef[] = [
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
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: () => null,
    },
  ];

  return columns;
}
