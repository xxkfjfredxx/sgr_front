import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { EmployeeList, EmployeeForm } from "@/pages/employees";
import { EmploymentLinkForm, EmploymentLinkList } from "@/pages/employment-links";
import EmployeeDocumentsPage from '@/pages/employees/EmployeeDocumentsPage';
import EmployeeDocumentsAdminPage from "@/pages/employees/EmployeeDocumentsAdminPage";
import IndicatorDashboard from "@/pages/dashboard/IndicatorDashboard";
import MedicalExamSelfPage from "@/pages/occupational-health/MedicalExamSelfPage";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "SST indicators",
        path: "/indicators",
        element: <IndicatorDashboard />,
      }, 
      {
        icon: <UserCircleIcon {...icon} />,
        name: "medical-exams",
        path: "/my-medical-exams",
        element: <MedicalExamSelfPage />,
      },     
      {
        icon: <PlusIcon {...icon} />,
        name: "add employee",
        path: "/create-employee",
        element: <EmployeeForm />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "employees",
        path: "/employees",
        element: <EmployeeList />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "employee documents",
        path: "/my-documents",
        element: <EmployeeDocumentsPage />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "upload docs",
        path: "/documents-upload",
        element: <EmployeeDocumentsAdminPage />,
      },
      {
        icon: <PlusIcon {...icon} />,
        name: "add employment link",
        path: "/employment-links-create",
        element: <EmploymentLinkForm />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "employment links",
        path: "/employments-link",
        element: <EmploymentLinkList />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
