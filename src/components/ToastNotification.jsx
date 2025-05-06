// src/components/ToastNotification.jsx
import React from "react";
import { Alert } from "@material-tailwind/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const iconMap = {
  success: <CheckCircleIcon className="h-5 w-5" />,
  warning: <ExclamationTriangleIcon className="h-5 w-5" />,
  info: <InformationCircleIcon className="h-5 w-5" />,
  error: <XCircleIcon className="h-5 w-5" />,
};

const colorMap = {
  success: "green",
  warning: "orange",
  info: "blue",
  error: "red",
};

export default function ToastNotification({ open, onClose, message, type = "info" }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] md:w-[600px]">
      <Alert
        open={open}
        onClose={onClose}
        icon={iconMap[type]}
        color={colorMap[type]}
        className="shadow-lg"
      >
        {message}
      </Alert>
    </div>
  );
}
