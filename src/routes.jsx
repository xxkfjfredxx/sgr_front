// src/routes.jsx

import { lazy } from 'react';
import { HomeIcon, UserCircleIcon, TableCellsIcon, InformationCircleIcon, PlusIcon, ServerStackIcon, RectangleStackIcon, BeakerIcon } from '@heroicons/react/24/solid';

import MedicalExamsPage from '@/pages/employees/MedicalExamsPage.jsx';

const DashboardPage = lazy(() => import('@/pages/dashboard/CalendarDashboard.jsx'));
const Profile = lazy(() => import('@/pages/dashboard/Profile.jsx'));
const Tables = lazy(() => import('@/pages/dashboard/Tables.jsx'));
const Notifications = lazy(() => import('@/pages/dashboard/Notifications.jsx'));
const IndicatorDashboard = lazy(() => import('@/pages/dashboard/IndicatorDashboard.jsx'));

const EmployeeList = lazy(() => import('@/pages/employees/EmployeeList.jsx'));
const EmployeeForm = lazy(() => import('@/pages/employees/EmployeeForm.jsx'));
const EmployeeWizardForm = lazy(() => import('@/pages/employees/EmployeeWizardForm.jsx'));
const EmploymentLinkForm = lazy(() => import('@/pages/employment-links/EmploymentLinkForm.jsx'));
const EmploymentLinkList = lazy(() => import('@/pages/employment-links/EmploymentLinkList.jsx'));
const EmployeeDocumentsPage = lazy(() => import('@/pages/employees/EmployeeDocumentsPage.jsx'));
const EmployeeDocumentsAdmin = lazy(() => import('@/pages/employees/EmployeeDocumentsAdminPage.jsx'));

const MedicalExamSelfPage = lazy(() => import('@/pages/occupational-health/MedicalExamSelfPage.jsx'));
const EmployeeMedicalExamsAdminPage = lazy(() => import('@/pages/occupational-health/EmployeeMedicalExamsAdminPage.jsx'));
const ActivityDetail = lazy(() => import('@/pages/activities/ActivityDetail.jsx'));

const SeguridadSaludHome = lazy(() => import('@/pages/dashboard/SeguridadSaludHome.jsx'));
const AbsencePage = lazy(() => import('@/pages/sst/AbsencePage.jsx'));
const TrainingPage = lazy(() => import('@/pages/sst/TrainingPage.jsx'));
const TrainingSessionDetail = lazy(() => import('@/pages/sst/TrainingSessionDetail.jsx'));

// Vacunaciones
const VaccinationList = lazy(() => import('@/pages/sst/VaccinationList.jsx'));
const VaccinationForm = lazy(() => import('@/pages/sst/VaccinationForm.jsx'));

// Accidentes de Trabajo
const WorkAccidentList = lazy(() => import('@/pages/sst/WorkAccidentList.jsx'));
const WorkAccidentForm = lazy(() => import('@/pages/sst/WorkAccidentForm.jsx'));

// Aptitud Médica
//const MedicalExamList = lazy(() => import('@/pages/sst/MedicalExamList.jsx'));
//const MedicalExamForm = lazy(() => import('@/pages/sst/MedicalExamForm.jsx'));

const SignIn = lazy(() => import('@/pages/auth/sign-in'));
const SignUp = lazy(() => import('@/pages/auth/sign-up'));

const EquipmentInventoryList = lazy(() => import('@/pages/sst/EquipmentInventoryList.jsx'));
const EquipmentInventoryForm = lazy(() => import('@/pages/sst/EquipmentInventoryForm.jsx'));
const EquipmentInspectionList = lazy(() => import('@/pages/sst/EquipmentInspectionList.jsx'));
const EquipmentInspectionForm = lazy(() => import('@/pages/sst/EquipmentInspectionForm.jsx'));

const RiskAssessmentList = lazy(() => import('@/pages/riesgos/RiskAssessmentList'));
const RiskAssessmentForm = lazy(() => import('@/pages/riesgos/RiskAssessmentForm.jsx'));
const RiskControlDetailPage = lazy(() => import('@/pages/riaesgos/RiskControlDetailPage.jsx'));
const RiskControlForm = lazy(() => import('@/pages/riesgos/RiskControlForm.jsx'));
const icon = { className: 'w-5 h-5 text-inherit' };

export const routes = [
  {
    layout: 'dashboard',
    pages: [
      { icon: <HomeIcon {...icon} />, name: 'Dashboard', path: '', element: <DashboardPage /> },
      { path: 'activities/:id', element: <ActivityDetail /> },
      { path: 'activities', element: <ActivityDetail /> },
      { icon: <TableCellsIcon {...icon} />, name: 'Indicadores SST', path: 'indicators', element: <IndicatorDashboard /> },

      // Empleados
      { path: 'employees/create-wizard', element: <EmployeeWizardForm /> },
      { icon: <UserCircleIcon {...icon} />, name: 'Lista Empleados', path: 'employees', element: <EmployeeList /> },
      { path: 'employees/:id/edit', element: <EmployeeForm /> },
      { path: 'employees/:id/documents', element: <EmployeeDocumentsPage /> },
      { path: 'employees/:id/medical-exams', element: <MedicalExamsPage /> },
      { icon: <UserCircleIcon {...icon} />, name: 'Subir Docs (Admin)', path: 'documents-upload', element: <EmployeeDocumentsAdmin /> },
      //{ icon: <UserCircleIcon {...icon} />, name: 'Exámenes Médicos (Admin)', path: 'medical-exams-admin', element: <EmployeeMedicalExamsAdminPage /> },
      { icon: <UserCircleIcon {...icon} />, name: 'Mis Exámenes Médicos', path: 'my-medical-exams', element: <MedicalExamSelfPage /> },

      // SST
      { icon: <TableCellsIcon {...icon} />, name: 'Seguridad y Salud', path: 'sst', element: <SeguridadSaludHome /> },
      { path: 'sst/ausentismo', element: <AbsencePage /> },
      { path: 'sst/capacitaciones', element: <TrainingPage /> },
      { path: 'sst/capacitaciones/:id', element: <TrainingSessionDetail /> },

      // Evaluación de Riesgos
      {
        icon: <BeakerIcon {...icon} />,
        name: 'Evaluaciones de Riesgos',
        path: 'riesgos',
        element: <RiskAssessmentList />
      },
      { path: 'riesgos/new', element: <RiskAssessmentForm /> },
      { path: 'riesgos/:id', element: <RiskAssessmentForm /> },

      // Control de Riesgos por Evaluación
      { path: 'riesgos/controles/:id', element: <RiskControlDetailPage /> },
      { path: 'riesgos/controles/:id/new', element: <RiskControlForm /> },
      { path: 'riesgos/controles/:id/edit/:controlId', element: <RiskControlForm /> },

      {
        path: 'sst/equipment',
        icon: <TableCellsIcon {...icon} />,
        name: 'Inventario Equipos',
        element: <EquipmentInventoryList />
      },
      { path: 'sst/equipment/new', element: <EquipmentInventoryForm /> },
      // <-- esta es la ruta de edición:
      { path: 'sst/equipment/:id', element: <EquipmentInventoryForm /> },

      // inspecciones (si quieres edición de inspecciones):
      { path: 'sst/equipment/:id/inspections', element: <EquipmentInspectionList /> },
      { path: 'sst/equipment/:id/inspections/new', element: <EquipmentInspectionForm /> },
      // para editar inspección:
      { path: 'sst/equipment/:id/inspections/:inspectionId', element: <EquipmentInspectionForm /> },

      // Aptitud Médica
      //{ path: 'sst/aptitud-medica', element: <MedicalExamList /> },
      //{ path: 'sst/aptitud-medica/new', element: <MedicalExamForm /> },
      //{ path: 'sst/aptitud-medica/:id', element: <MedicalExamForm /> },

      // Accidentes de Trabajo
      { path: 'sst/accidentes', element: <WorkAccidentList /> },
      { path: 'sst/accidentes/new', element: <WorkAccidentForm /> },
      { path: 'sst/accidentes/:id', element: <WorkAccidentForm /> },

      // Vacunaciones
      { icon: <BeakerIcon {...icon} />, name: 'Vacunaciones', path: 'sst/vaccinations', element: <VaccinationList /> },
      { path: 'sst/vaccinations/new', element: <VaccinationForm /> },

      // Otras
      { icon: <UserCircleIcon {...icon} />, name: 'Perfil', path: 'profile', element: <Profile /> },
      { icon: <TableCellsIcon {...icon} />, name: 'Tablas', path: 'tables', element: <Tables /> },
      { icon: <InformationCircleIcon {...icon} />, name: 'Notificaciones', path: 'notifications', element: <Notifications /> }
    ]
  },
  {
    layout: 'auth',
    pages: [
      { icon: <ServerStackIcon {...icon} />, name: 'Sign In', path: '/sign-in', element: <SignIn /> },
      { icon: <RectangleStackIcon {...icon} />, name: 'Sign Up', path: '/sign-up', element: <SignUp /> },
      { path: 'employees/create', element: <EmployeeForm /> },
      { path: 'my-documents', element: <EmployeeDocumentsPage /> },
      { path: 'employment-links/create', element: <EmploymentLinkForm /> },
      { path: 'employment-links', element: <EmploymentLinkList /> }
    ]
  }
];

export default routes;
