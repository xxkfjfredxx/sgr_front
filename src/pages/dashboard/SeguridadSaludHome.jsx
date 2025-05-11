import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {
  ChartBarSquareIcon as Activity,
  AcademicCapIcon as GraduationCap,
  ExclamationTriangleIcon as AlertTriangle,
  HeartIcon as HeartPulse,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { EmpresaContext } from "@/context/EmpresaContext";

/**
 * Página de inicio del módulo Seguridad y Salud en el Trabajo (SST).
 * Muestra cuatro tarjetas que redirigen a las páginas:
 *  - /dashboard/sst/ausentismo
 *  - /dashboard/sst/capacitaciones
 *  - /dashboard/sst/accidentes
 *  - /dashboard/sst/aptitud-medica
 */
export default function SeguridadSaludHome() {
  const { empresaId } = useContext(EmpresaContext);

  const modules = [
    { name: "Ausentismo", path: "ausentismo", icon: Activity },
    { name: "Capacitaciones", path: "capacitaciones", icon: GraduationCap },
    { name: "Accidentes", path: "accidentes", icon: AlertTriangle },
    { name: "Aptitud Médica", path: "aptitud-medica", icon: HeartPulse },
  ];

  if (!empresaId) {
    return (
      <div className="p-8 text-center">
        <Typography variant="h5">Selecciona una empresa para comenzar</Typography>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {modules.map(({ name, path, icon: Icon }) => (
        <Link key={path} to={path} className="group" state={{ empresaId }}>
          <Card className="cursor-pointer hover:shadow-xl transition-all rounded-2xl">
            <CardBody className="flex flex-col items-center justify-center gap-4 py-10">
              <Icon className="w-12 h-12 stroke-1 group-hover:scale-110 transition-transform" />
              <Typography variant="h6" className="text-center">
                {name}
              </Typography>
              <Button size="sm" color="blue" className="mt-2" variant="filled">
                Gestionar
              </Button>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}
