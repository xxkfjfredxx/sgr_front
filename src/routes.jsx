import { lazy } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  PlusIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import MedicalExamsPage from "@/pages/employees/MedicalExamsPage";

const DashboardPage = lazy(() => import("@/pages/dashboard/CalendarDashboard.jsx"));
const Profile = lazy(() => import("@/pages/dashboard/Profile.jsx"));
const Tables = lazy(() => import("@/pages/dashboard/Tables.jsx"));
const Notifications = lazy(() => import("@/pages/dashboard/Notifications.jsx"));
const IndicatorDashboard = lazy(() => import("@/pages/dashboard/IndicatorDashboard.jsx"));

const EmployeeList = lazy(() => import("@/pages/employees/EmployeeList.jsx"));
const EmployeeForm = lazy(() => import("@/pages/employees/EmployeeForm.jsx"));
const EmploymentLinkForm = lazy(() => import("@/pages/employment-links/EmploymentLinkForm.jsx"));
const EmploymentLinkList = lazy(() => import("@/pages/employment-links/EmploymentLinkList.jsx"));
const EmployeeDocumentsPage = lazy(() => import("@/pages/employees/EmployeeDocumentsPage.jsx"));
const EmployeeDocumentsAdmin = lazy(() => import("@/pages/employees/EmployeeDocumentsAdminPage.jsx"));

const MedicalExamSelfPage = lazy(() => import("@/pages/occupational-health/MedicalExamSelfPage.jsx"));
const EmployeeMedicalExamsAdminPage = lazy(() => import("@/pages/occupational-health/EmployeeMedicalExamsAdminPage.jsx"));
const ActivityDetail = lazy(() => import("@/pages/activities/ActivityDetail.jsx"));

const SignIn = lazy(() => import("@/pages/auth/sign-in"));
const SignUp = lazy(() => import("@/pages/auth/sign-up"));

const icon = { className: "w-5 h-5 text-inherit" };

export const routes = [
  {
    layout: "dashboard",
    pages: [
      { icon: <HomeIcon {...icon} />, name: "Dashboard", path: "", element: <DashboardPage /> },
      { path: "activities/:id", element: <ActivityDetail /> },
      { icon: <TableCellsIcon {...icon} />, name: "Indicadores SST", path: "indicators", element: <IndicatorDashboard /> },
      { icon: <UserCircleIcon {...icon} />, name: "Exámenes médicos", path: "my-medical-exams", element: <MedicalExamSelfPage /> },

      // Empleados
      { icon: <PlusIcon {...icon} />, name: "Crear Empleado", path: "employees/create", element: <EmployeeForm /> },
      { icon: <UserCircleIcon {...icon} />, name: "Lista Empleados", path: "employees", element: <EmployeeList /> },
      { path: "/employees/:id/documents", element: <EmployeeDocumentsPage /> },
      { path: "/employees/:id/medical-exams", element: <MedicalExamsPage /> },
      { path: "employees/:id/edit", element: <EmployeeForm /> },

      // Documentos y exámenes admin
      { icon: <UserCircleIcon {...icon} />, name: "Mis Documentos", path: "my-documents", element: <EmployeeDocumentsPage /> },
      { icon: <UserCircleIcon {...icon} />, name: "Subir Docs (Admin)", path: "documents-upload", element: <EmployeeDocumentsAdmin /> },
      { icon: <UserCircleIcon {...icon} />, name: "Exámenes Médicos (Admin)", path: "medical-exams-admin", element: <EmployeeMedicalExamsAdminPage /> },

      // Vínculos laborales
      { icon: <PlusIcon {...icon} />, name: "Crear Vínculo", path: "employment-links/create", element: <EmploymentLinkForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Vínculos", path: "employment-links", element: <EmploymentLinkList /> },

      // Otras
      { icon: <UserCircleIcon {...icon} />, name: "Perfil", path: "profile", element: <Profile /> },
      { icon: <TableCellsIcon {...icon} />, name: "Tablas", path: "tables", element: <Tables /> },
      { icon: <InformationCircleIcon {...icon} />, name: "Notificaciones", path: "notifications", element: <Notifications /> },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      { icon: <ServerStackIcon {...icon} />, name: "Sign In", path: "/sign-in", element: <SignIn /> },
      { icon: <RectangleStackIcon {...icon} />, name: "Sign Up", path: "/sign-up", element: <SignUp /> },
    ],
  },
];

export default routes;
