import React from 'react';
import { Typography, Container } from '@mui/material';

const Unauthorized = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Unauthorized
      </Typography>
      <Typography variant="body1">
        You do not have permission to access this page.
      </Typography>
    </Container>
  );
};

export default Unauthorized;