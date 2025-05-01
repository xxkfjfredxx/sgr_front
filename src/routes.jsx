// routes.jsx
import { lazy } from "react";
import { HomeIcon, UserCircleIcon, TableCellsIcon, InformationCircleIcon,
         ServerStackIcon, RectangleStackIcon, PlusIcon } from "@heroicons/react/24/solid";

// lazy imports → componentes se cargan al usarse, rompe el círculo
const Dashboard              = lazy(() => import("@/pages/dashboard/Dashboard"));
const Profile                = lazy(() => import("@/pages/dashboard/Profile"));
const Tables                 = lazy(() => import("@/pages/dashboard/Tables"));
const Notifications          = lazy(() => import("@/pages/dashboard/Notifications"));

const EmployeeList           = lazy(() => import("@/pages/employees/EmployeeList"));
const EmployeeForm           = lazy(() => import("@/pages/employees/EmployeeForm"));
const EmploymentLinkForm     = lazy(() => import("@/pages/employment-links/EmploymentLinkForm"));
const EmploymentLinkList     = lazy(() => import("@/pages/employment-links/EmploymentLinkList"));
const EmployeeDocumentsPage  = lazy(() => import("@/pages/employees/EmployeeDocumentsPage"));
const EmployeeDocumentsAdmin = lazy(() => import("@/pages/employees/EmployeeDocumentsAdminPage"));
const IndicatorDashboard     = lazy(() => import("@/pages/dashboard/IndicatorDashboard"));
const MedicalExamSelfPage    = lazy(() => import("@/pages/occupational-health/MedicalExamSelfPage"));
const ActivityDetail         = lazy(() => import("@/pages/activities/ActivityDetail"));

const SignIn  = lazy(() => import("@/pages/auth/SignIn"));
const SignUp  = lazy(() => import("@/pages/auth/SignUp"));

const icon = { className: "w-5 h-5 text-inherit" };

export const routes = [
  {
    layout: "dashboard",
    pages: [
      { icon: <HomeIcon {...icon} />, name: "dashboard",       path: "/",                  element: <Dashboard /> },
      { icon: null,                     name: "activity detail", path: "/activities/:id",   element: <ActivityDetail /> },
      { icon: <TableCellsIcon {...icon} />, name: "SST indicators", path: "/indicators",    element: <IndicatorDashboard /> },
      { icon: <UserCircleIcon {...icon} />, name: "medical exams",  path: "/my-medical-exams", element: <MedicalExamSelfPage /> },
      { icon: <PlusIcon {...icon} />,       name: "add employee",   path: "/create-employee",  element: <EmployeeForm /> },
      { icon: <UserCircleIcon {...icon} />, name: "employees",      path: "/employees",        element: <EmployeeList /> },
      { icon: <UserCircleIcon {...icon} />, name: "employee documents", path: "/my-documents", element: <EmployeeDocumentsPage /> },
      { icon: <UserCircleIcon {...icon} />, name: "upload docs",    path: "/documents-upload", element: <EmployeeDocumentsAdmin /> },
      { icon: <PlusIcon {...icon} />,       name: "add employment link", path: "/employment-links-create", element: <EmploymentLinkForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "employment links", path: "/employments-link", element: <EmploymentLinkList /> },
      { icon: <UserCircleIcon {...icon} />, name: "profile",        path: "/profile",          element: <Profile /> },
      { icon: <TableCellsIcon {...icon} />, name: "tables",         path: "/tables",           element: <Tables /> },
      { icon: <InformationCircleIcon {...icon} />, name: "notifications", path: "/notifications", element: <Notifications /> },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      { icon: <ServerStackIcon {...icon} />,   name: "sign in", path: "/sign-in", element: <SignIn /> },
      { icon: <RectangleStackIcon {...icon} />, name: "sign up", path: "/sign-up", element: <SignUp /> },
    ],
  },
];

export default routes;
