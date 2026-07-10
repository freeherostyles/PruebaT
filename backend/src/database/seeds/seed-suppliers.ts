import 'reflect-metadata';
import dataSource from '../typeorm.config';
import { Supplier } from '../../modules/suppliers/supplier.entity';
import { User } from '../../modules/users/user.entity';
import { SupplierType } from '../../modules/suppliers/supplier-type.enum';
import { SupplierStatus } from '../../modules/suppliers/supplier-status.enum';
import { UserRole } from '../../modules/users/user-role.enum';

interface SeedSupplier {
  supplierType: SupplierType;
  status: SupplierStatus;
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

const suppliers: SeedSupplier[] = [
  // Personas físicas (5)
  {
    supplierType: SupplierType.PERSONA_FISICA,
    status: SupplierStatus.ACTIVE,
    firstName: 'Juan',
    lastName: 'Pérez',
    secondLastName: 'López',
    rfc: 'JUAN920101ABC',
    curp: 'JUAN920101HDFLRN01',
    contactPerson: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '5512345678',
  },
  {
    supplierType: SupplierType.PERSONA_FISICA,
    status: SupplierStatus.ACTIVE,
    firstName: 'María',
    lastName: 'García',
    secondLastName: 'Hernández',
    rfc: 'MARA880512DEF',
    curp: 'MARA880512MDFHNR02',
    contactPerson: 'María García',
    email: 'maria.garcia@example.com',
    phone: '5523456789',
  },
  {
    supplierType: SupplierType.PERSONA_FISICA,
    status: SupplierStatus.INACTIVE,
    firstName: 'Pedro',
    lastName: 'Martínez',
    secondLastName: 'Sánchez',
    rfc: 'PEDR750623GHI',
    curp: 'PEDR750623HDFSNR03',
    contactPerson: 'Pedro Martínez',
    email: 'pedro.martinez@example.com',
    phone: '5534567890',
  },
  {
    supplierType: SupplierType.PERSONA_FISICA,
    status: SupplierStatus.ACTIVE,
    firstName: 'Luis',
    lastName: 'Ramírez',
    secondLastName: 'Torres',
    rfc: 'LUIS900815JKL',
    curp: 'LUIS900815HDFTRR04',
    contactPerson: 'Luis Ramírez',
    email: 'luis.ramirez@example.com',
    phone: '5545678901',
  },
  {
    supplierType: SupplierType.PERSONA_FISICA,
    status: SupplierStatus.ACTIVE,
    firstName: 'Sofía',
    lastName: 'Flores',
    secondLastName: 'Vega',
    rfc: 'SOFI820104MNO',
    curp: 'SOFI820104MDFVGR05',
    contactPerson: 'Sofía Flores',
    email: 'sofia.flores@example.com',
    phone: '5556789012',
  },
  // Personas morales (5)
  {
    supplierType: SupplierType.PERSONA_MORAL,
    status: SupplierStatus.ACTIVE,
    businessName: 'Comercializadora del Norte S.A. de C.V.',
    tradeName: 'Comercial Norte',
    rfc: 'COM920101ABC',
    contactPerson: 'Lic. Roberto Díaz',
    email: 'contacto@comercialnorte.com',
    phone: '5567890123',
  },
  {
    supplierType: SupplierType.PERSONA_MORAL,
    status: SupplierStatus.ACTIVE,
    businessName: 'Servicios Tecnológicos del Sur S.A.P.I. de C.V.',
    tradeName: 'ServiTec Sur',
    rfc: 'SER880512DEF',
    contactPerson: 'Ing. Ana Ruiz',
    email: 'info@servitec.com',
    phone: '5578901234',
  },
  {
    supplierType: SupplierType.PERSONA_MORAL,
    status: SupplierStatus.INACTIVE,
    businessName: 'Tecnología y Desarrollo del Valle S.A. de C.V.',
    tradeName: 'TecnoValle',
    rfc: 'TEC750623GHI',
    contactPerson: 'Mtro. Carlos Mendoza',
    email: 'contacto@tecnovalle.com',
    phone: '5589012345',
  },
  {
    supplierType: SupplierType.PERSONA_MORAL,
    status: SupplierStatus.ACTIVE,
    businessName: 'Industrias del Centro S.A. de C.V.',
    tradeName: 'IndusCentro',
    rfc: 'IND900815JKL',
    contactPerson: 'CP. Laura Orozco',
    email: 'ventas@induscentro.com',
    phone: '5590123456',
  },
  {
    supplierType: SupplierType.PERSONA_MORAL,
    status: SupplierStatus.ACTIVE,
    businessName: 'Proveedores Especializados del Pacífico S.A. de C.V.',
    tradeName: 'Proveedores Pacífico',
    rfc: 'PRO820104MNO',
    contactPerson: 'Sr. Javier Torres',
    email: 'pedidos@proveedorespacifico.com',
    phone: '5501234567',
  },
];

async function run() {
  await dataSource.initialize();
  try {
    const userRepo = dataSource.getRepository(User);
    const admin = await userRepo.findOneBy({ role: UserRole.ADMIN });
    if (!admin) {
      throw new Error('Admin user not found. Run seed:users first.');
    }

    const supplierRepo = dataSource.getRepository(Supplier);
    for (const data of suppliers) {
      const existing = await supplierRepo.findOne({
        where: { rfc: data.rfc },
        withDeleted: true,
      });
      if (existing) continue;

      const supplier = supplierRepo.create({
        ...data,
        createdBy: admin,
      });
      await supplierRepo.save(supplier);
    }

    console.log(`Seeded ${suppliers.length} suppliers successfully.`);
  } finally {
    await dataSource.destroy();
  }
}

void run();
