export type SupplierType = 'PERSONA_FISICA' | 'PERSONA_MORAL';

export type SupplierStatus = 'ACTIVE' | 'INACTIVE';

export interface Supplier {
  id: string;
  supplierType: SupplierType;
  status: SupplierStatus;
  firstName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  businessName: string | null;
  tradeName: string | null;
  rfc: string;
  curp: string | null;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  createdById: string;
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupplierListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SupplierListResponse {
  data: Supplier[];
  meta: SupplierListMeta;
}

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
  personaFisica: number;
  personaMoral: number;
}

export interface SupplierFilters {
  search: string;
  type: SupplierType | '';
  status: SupplierStatus | '';
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  page: number;
  limit: number;
}

export interface CreateSupplierPayload {
  supplierType: SupplierType;
  firstName?: string;
  lastName?: string;
  secondLastName?: string;
  businessName?: string;
  tradeName?: string;
  rfc: string;
  curp?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

export interface UpdateSupplierPayload {
  firstName?: string | null;
  lastName?: string | null;
  secondLastName?: string | null;
  businessName?: string | null;
  tradeName?: string | null;
  rfc?: string;
  curp?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
}
