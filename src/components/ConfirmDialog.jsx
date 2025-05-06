import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
  } from "@material-tailwind/react";
  
  const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
    return (
      <Dialog open={open} handler={onCancel}>
        <DialogHeader>{title || "¿Estás seguro?"}</DialogHeader>
        <DialogBody>
          <p>{message || "Esta acción no se puede deshacer."}</p>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={onCancel} className="mr-2">
            Cancelar
          </Button>
          <Button variant="gradient" color="red" onClick={onConfirm}>
            Sí, eliminar
          </Button>
        </DialogFooter>
      </Dialog>
    );
  };
  
  export default ConfirmDialog;
  