// src/widgets/layout/sidenav.jsx
import React, { useTransition } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav, sidenavColor } = controller;
  const navigate = useNavigate();
  const location = useLocation();
  const [isPending, startTransition] = useTransition();

  const sidenavStyles = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavStyles[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      {/* Header */}
      <div className="relative">
        <div className="py-6 px-8 text-center">
          <img src={brandImg} alt="logo" className="h-8 mx-auto mb-2" />
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            {brandName}
          </Typography>
        </div>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>

      {/* Menu */}
      <div className="m-4 overflow-y-auto h-[calc(100vh-180px)] pr-1">
        {routes.map(({ layout, title, pages }, section) => (
          <ul key={section} className="mb-6">
            {title && (
              <li className="mx-3.5 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => {
              const to = `/${layout}${path}`;
              const isActive = location.pathname === to;
              return (
                <li key={name} className="mb-1">
                  <Button
                    onClick={() =>
                      startTransition(() => {
                        navigate(to);
                        setOpenSidenav(dispatch, false);
                      })
                    }
                    variant={isActive ? "gradient" : "text"}
                    color={isActive ? sidenavColor : "blue-gray"}
                    className="flex items-center gap-4 px-4 normal-case w-full"
                    fullWidth
                    disabled={isPending}
                  >
                    {icon}
                    <Typography color="inherit" className="font-medium">
                      {name}
                    </Typography>
                    {isPending && isActive && (
                      <span className="text-xs text-white ml-auto">…</span>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Material Tailwind React",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
