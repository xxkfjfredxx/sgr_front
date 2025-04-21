import React, { useEffect, useState } from 'react';
import { Typography, Card, CardBody } from '@material-tailwind/react';
import api from '@/services/api';

const EmploymentLinkList = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await api.get('/employment-links/');
        setLinks(res.data);
      } catch (error) {
        console.error('Error fetching employment links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Employment Links
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        links.map((link) => (
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
              <Typography>From: {link.start_date} To: {link.end_date || 'Present'}</Typography>
              <Typography>Status: {link.status}</Typography>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
};

export default EmploymentLinkList;
