import {
    Card, CardHeader, CardBody, Typography, Button,
  } from "@material-tailwind/react";
  import { PlusIcon } from "@heroicons/react/24/outline";
  
  export default function MedicalAptitudePage() {
    return (
      <section className="p-6">
        <Card>
          <CardHeader floated={false} shadow={false} className="flex justify-between">
            <div>
              <Typography variant="h5">Aptitud Médica</Typography>
              <Typography variant="small" className="opacity-70">
                Resultados de exámenes de ingreso, periódicos y retiro
              </Typography>
            </div>
            <Button size="sm" color="blue" className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" /> Registrar examen
            </Button>
          </CardHeader>
  
          <CardBody>
            {/* Placeholder */}
            <Typography className="opacity-70">Lista de exámenes en construcción.</Typography>
          </CardBody>
        </Card>
      </section>
    );
  }
  