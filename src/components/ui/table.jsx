import React from "react";

// Table como export default
export default function Table({ children, className = "min-w-full bg-white" }) {
  return <table className={className}>{children}</table>;
}

// Subcomponentes de tabla
export function TableHeader({ children, className = "bg-gray-100" }) {
  return <thead className={className}>{children}</thead>;
}
export function TableBody({ children, className = "divide-y" }) {
  return <tbody className={className}>{children}</tbody>;
}
export function TableRow({ children, className = "hover:bg-gray-50" }) {
  return <tr className={className}>{children}</tr>;
}
export function TableCell({ children, className = "px-4 py-2" }) {
  return <td className={className}>{children}</td>;
}