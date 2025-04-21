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
        icon: <UserCircleIcon {...icon} />,
        name: "employees",
        path: "/employees",
        element: <EmployeeList />,
      },
      {
        icon: <PlusIcon {...icon} />,
        name: "add employee",
        path: "/employees/create",
        element: <EmployeeForm />,
      },
      {
        icon: <PlusIcon {...icon} />,
        name: "add employment link",
        path: "/employment-links/create",
        element: <EmploymentLinkForm />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "employment links",
        path: "/employment-links",
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
