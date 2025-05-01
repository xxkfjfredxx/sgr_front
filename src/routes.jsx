import { lazy } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

const Dashboard              = lazy(() => import("@/pages/dashboard/Dashboard.jsx"));
const Profile                = lazy(() => import("@/pages/dashboard/Profile.jsx"));
const Tables                 = lazy(() => import("@/pages/dashboard/Tables.jsx"));
const Notifications          = lazy(() => import("@/pages/dashboard/Notifications.jsx"));
const IndicatorDashboard     = lazy(() => import("@/pages/dashboard/IndicatorDashboard.jsx"));

const EmployeeList           = lazy(() => import("@/pages/employees/EmployeeList.jsx"));
const EmployeeForm           = lazy(() => import("@/pages/employees/EmployeeForm.jsx"));
const EmploymentLinkForm     = lazy(() => import("@/pages/employment-links/EmploymentLinkForm.jsx"));
const EmploymentLinkList     = lazy(() => import("@/pages/employment-links/EmploymentLinkList.jsx"));
const EmployeeDocumentsPage  = lazy(() => import("@/pages/employees/EmployeeDocumentsPage.jsx"));
const EmployeeDocumentsAdmin = lazy(() => import("@/pages/employees/EmployeeDocumentsAdminPage.jsx"));

const MedicalExamSelfPage    = lazy(() => import("@/pages/occupational-health/MedicalExamSelfPage.jsx"));
const ActivityDetail         = lazy(() => import("@/pages/activities/ActivityDetail.jsx"));

const SignIn                 = lazy(() => import("@/pages/auth/SignIn.jsx"));
const SignUp                 = lazy(() => import("@/pages/auth/SignUp.jsx"));

const icon = { className: "w-5 h-5 text-inherit" };

export const routes = [
  {
    layout: "dashboard",
    pages: [
      { icon: <HomeIcon {...icon} />,           name: "Dashboard",                  path: "/",                             element: <Dashboard /> },
      { icon: null,                             name: "Activity Detail",            path: "/activities/:id",               element: <ActivityDetail /> },
      { icon: <TableCellsIcon {...icon} />,     name: "SST Indicators",             path: "/indicators",                   element: <IndicatorDashboard /> },
      { icon: <UserCircleIcon {...icon} />,     name: "Medical Exams",              path: "/my-medical-exams",             element: <MedicalExamSelfPage /> },

      // Empleados
      {
        icon: <PlusIcon {...icon} />,
        name: "Crear Empleado",
        path: "/employees/create",
        element: <EmployeeForm />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Lista de Empleados",
        path: "/employees",
        element: <EmployeeList />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Editar Empleado",
        path: "/employees/:id/edit",
        element: <EmployeeForm />,
      },

      // Documentos
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Mis Documentos",
        path: "/my-documents",
        element: <EmployeeDocumentsPage />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Subir Docs (Admin)",
        path: "/documents-upload",
        element: <EmployeeDocumentsAdmin />,
      },

      // Vínculos laborales
      {
        icon: <PlusIcon {...icon} />,
        name: "Crear Vínculo",
        path: "/employment-links/create",
        element: <EmploymentLinkForm />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Vínculos",
        path: "/employment-links",
        element: <EmploymentLinkList />,
      },

      // Otras
      { icon: <UserCircleIcon {...icon} />,      name: "Perfil",                     path: "/dashboard/profile",            element: <Profile /> },
      { icon: <TableCellsIcon {...icon} />,      name: "Tablas",                     path: "/dashboard/tables",             element: <Tables /> },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Notificaciones",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      { icon: <ServerStackIcon {...icon} />,    name: "Sign In",  path: "/sign-in", element: <SignIn /> },
      { icon: <RectangleStackIcon {...icon} />, name: "Sign Up",  path: "/sign-up", element: <SignUp /> },
    ],
  },
];

export default routes;
