import React from 'react';
import { Typography, Card, CardBody, Spinner } from '@material-tailwind/react';
import { useEmploymentLinks } from '@/hooks/useEmploymentLinks';

const EmploymentLinkList = () => {
  const { links, loading, error } = useEmploymentLinks();

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Employment Links
      </Typography>

      {loading && (
        <div className="text-blue-600 flex items-center gap-2 mb-4">
          <Spinner className="h-5 w-5" /> Loading employment links...
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 text-sm mb-4">
          ⚠️ Error loading employment links: {error}
        </div>
      )}

      {!loading && !error && links.length === 0 && (
        <Typography className="text-gray-500">No employment links found.</Typography>
      )}

      {!loading && !error && links.map((link) => (
        <Card key={link.id} className="mb-4">
          <CardBody>
            <Typography variant="h6">
              {link.employee_name || `Employee ID: ${link.employee}`}
            </Typography>
            <Typography>Company: {link.company_name || link.company}</Typography>
            <Typography>Position: {link.position_name || link.position}</Typography>
            <Typography>Area: {link.work_area_name || link.work_area}</Typography>
            <Typography>Salary: ${link.salary}</Typography>
            <Typography>Contract: {link.contract_type}</Typography>
            <Typography>
              From: {link.start_date} To: {link.end_date || 'Present'}
            </Typography>
            <Typography>Status: {link.status}</Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default EmploymentLinkList;
