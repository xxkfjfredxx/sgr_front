import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import routes from "@/routes";
import { Sidenav, DashboardNavbar, Configurator, Footer } from "@/widgets/layout";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  const dashPages = routes.find((r) => r.layout === "dashboard")?.pages || [];

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"}
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        <Suspense fallback={<div className="p-4">Cargando módulo...</div>}>
          <Routes>
            {dashPages.map(({ path, element }) =>
              path === "" ? (
                <Route index element={element} key="dashboard-index" />
              ) : (
                <Route path={path} element={element} key={path} />
              )
            )}
          </Routes>
        </Suspense>

        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
