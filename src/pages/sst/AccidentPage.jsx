import {
    Card, CardHeader, CardBody, Typography, Button,
  } from "@material-tailwind/react";
  import { PlusIcon } from "@heroicons/react/24/outline";
  
  export default function AccidentPage() {
    return (
      <section className="p-6">
        <Card>
          <CardHeader floated={false} shadow={false} className="flex justify-between">
            <div>
              <Typography variant="h5">Accidentes / Incidentes</Typography>
              <Typography variant="small" className="opacity-70">
                Registro y línea de tiempo de eventos
              </Typography>
            </div>
            <Button size="sm" color="blue" className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" /> Nuevo evento
            </Button>
          </CardHeader>
  
          <CardBody>
            {/* Placeholder */}
            <Typography className="opacity-70">Aquí aparecerán los registros.</Typography>
          </CardBody>
        </Card>
      </section>
    );
  }
  